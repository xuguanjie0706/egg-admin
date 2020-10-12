"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/user");
const Role = require("../../database/schema/role");
const Verification = require("../../database/schema/verification");
const dayjs = require("dayjs");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const { getCodeTX, getCodeAL } = require("../../untils/VerficationSDK/index");

class UserController extends Controller {
  /**
  * @description:  管理员登录 isUser必须为1
  * @param {type}
  * @return:
  */

  // async addbyAdmin() {
  //   const { ctx } = this;
  //   let query = {};
  //   try {
  //     const data = ctx.request.body;
  //     console.log(data);
  //     const newdata = data._id ? {} : new Model();

  //     const olddata = {
  //       _id: data._id ? data._id : newdata._id
  //     };
  //     delete data._id;
  //     Object.keys(data).forEach(key => newdata[key] = data[key]);
  //     console.log(olddata);
  //     query = await Model.findOneAndUpdate(olddata, newdata, {
  //       new: true,
  //       upsert: true,
  //       runValidators: true
  //     });
  //     ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
  //   } catch (error) {
  //     ctx.logger.error(error);
  //     ctx.body = doErr(error);
  //   }

  // }


  /**
   * @description:  管理员登录 isUser必须为1
   * @param {type}
   * @return:
   */
  async loginAdmin() {
    const { ctx } = this;
    let query = {};
    try {
      const data = ctx.request.body;
      const searchData = {
        name: data.name,
        password: data.password,
        isUsed: "1",
        $or: [{
          isUser: "1"
        }, {
          isUser: "2"
        }]

      };
      // console.log(searchData);
      const result = await Model.countDocuments(searchData);

      if (result === 0) {
        throw new Error("账号或密码错误");
      }

      query = await Model.findOneAndUpdate(searchData, {
        lastLoginAt: new Date()
      }, {
        new: true,
        runValidators: true
      }).populate({
        path: "_role",
        populate: [{
          path: "auth._menu",
          select: "name _id icon url"
        }, {
          path: "auth._menulist",
          select: "-createdAt -updatedAt"
        }],
      }).populate({
        path: "_supplier"
      })
        .exec();

      query = setData(query, "ok", ["updatedAt", "lastLoginAt"]);

      await getToken({
        _id: query.data._id,
        isUser: query.data.isUser
      }).then(r => {
        query.data.token = r.token;
      });

      ctx.body = query;
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }


  /**
   * @description: 用户登录  isUser 传参
   * @param {type}
   * @return:
   */
  async loginUser() {
    const { ctx } = this;
    let query = {};
    try {
      const data = ctx.request.body;
      const searchData = {
        name: data.name,
        password: data.password,
        isUsed: 1,
        isUser: data.isUser
      };


      const result = await Model.countDocuments(searchData);

      if (result === 0) {
        throw new Error("账号或密码错误");
      }

      query = await Model.findOneAndUpdate(searchData, {
        lastLoginAt: new Date()
      }, {
        new: true,
        runValidators: true
      }).populate({
        path: "_role",
        populate: [{
          path: "auth._menu",
          select: "name _id icon url"
        }, {
          path: "auth._menulist",
          select: "-createdAt -updatedAt"
        }],
      }).populate({
        path: "_supplier"
      })
        .exec();

      query = setData(query, "ok", ["updatedAt", "lastLoginAt"]);

      await getToken({
        _id: query.data._id,
        isUser: query.data.isUser
      }).then(r => {
        query.data.token = r.token;
      });

      ctx.body = query;
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
   * @description:  用户列表
   * @param {type}
   * @return:
   */
  async page() {
    const { ctx } = this;
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const page = data.page || 0;
      const count = data.count ? Number(data.count) : 10;
      const searchData = fitlerSearch(data);
      const skip = page * count;
      const r1 = await Model.find(searchData).limit(count).skip(skip)
        .populate({
          path: "_role",
          select: "name"
        })
        .sort({
          createdAt: -1
        }).exec();
      const r2 = await Model.countDocuments(searchData).exec();
      query = {
        list: r1,
        total: r2
      };
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
   * @description:  用户token 验证
   * @param {type}
   * @return:
   */
  async check() {
    const { ctx } = this;
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const searchData = {
        _id: tokenData._id
      };
      query = await Model.findOne(searchData)
        .populate({
          path: "_role",
          populate: [{
            path: "auth._menu",
            select: "name _id icon url"
          }, {
            path: "auth._menulist",
            select: "-createdAt -updatedAt"
          }],
        }).populate({
          path: "_supplier"
        })
        .sort({
          createdAt: -1
        }).exec();

      query = setData(query, "ok", ["updatedAt", "lastLoginAt"]);
      ctx.body = query;
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
     * @description:  商户注册
     * @param {type}
     * @return:
  */
  async addbyself() {
    const { ctx } = this;
    let query = {};
    try {
      const data = ctx.request.body;
      const result = await Verification.findOne({
        phone: data.phone,
        num: data.verification,
        overtime: {
          $gt: new Date()
        }
      }).sort({
        createdAt: -1
      }).exec();
      if (!result) {
        throw new Error("验证码不对或已过期");
      }
      const newdata = new Model();
      Object.keys(data).forEach(key => newdata[key] = data[key]);
      // newdata.isUsed = "0";
      newdata.isUser = "2";
      newdata.status = 1;
      newdata._role = ["5f6479171cc2cf1a44ffdeaa"];
      newdata.overtime = dayjs().add(7, "day").valueOf();
      query = await newdata.save(newdata);
      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
       * @description:  修改密码
       * @param {type}
       * @return:
    */

  async forget() {
    const { ctx } = this;
    let query = {};
    try {
      const data = ctx.request.body;
      const result = await Verification.findOne({
        phone: data.phone,
        num: data.verification,
        overtime: {
          $gt: new Date()
        }
      }).sort({
        createdAt: -1
      }).exec();
      if (!result) {
        throw new Error("验证码不对或已过期");
      }
      const olddata = {
        name: data.name,
        phone: data.phone
      };
      const newdata = {
        password: data.password
      };

      query = await Model.updateOne(olddata, newdata, {
        runValidators: true
      });
      // console.log(query);
      if (!query.nModified) {
        throw new Error("修改失败,请检查账号");
      }
      ctx.body = setData(query, "ok");
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
     * @description:  验证码获取
     * @param {type}
     * @return:
  */

  async getVerfication() {
    const { ctx } = this;
    const query = {};
    try {
      const data = ctx.request.body;
      const { phone } = data;
      if (!phone) {
        throw new Error("请填写手机号");
      }
      const r = await getCodeAL(phone);
      const verification = new Verification();
      verification.num = r;
      verification.phone = phone;
      verification.overtime = dayjs().add(5, "minute").toDate();
      await verification.save();
      ctx.body = setData(query, "ok");
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }

  }


  /**
   * @description:  获取个人信息
   * @param {type}
   * @return:
  */

  async getone() {
    let query = {};
    const { ctx } = this;
    try {
      // const { token } = ctx.request.header;
      // const tokenData = await checkToken(token);
      // if (!tokenData) {
      //   throw new Error("token失效或不存在");
      // }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      query = await Model.findOne(searchData, "overtime status")
        .sort({
          createdAt: -1
        }).exec();

      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
   * @description:  商户续期
   * @param {type}
   * @return:
  */

  async renewMember() {
    let query = {};
    const { ctx } = this;
    try {

      const role = await Role.findOne({
        name: "商户"
      });
      if (!role) {
        throw new Error("权限不存在");
      }
      const data = ctx.request.body;
      const olddata = {
        _id: data._id
      };
      const newdata = {
        overtime: data.overtime,
        status: true,
        _role: role._id
      };

      query = await Model.updateMany(olddata, newdata)
        .exec();

      if (!query.nModified) {
        throw new Error("更新失败");
      }

      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }


}

module.exports = UserController;
