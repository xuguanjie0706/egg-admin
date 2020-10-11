/* eslint-disable prefer-destructuring */
"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/exchangeCard");
const User = require("../../database/schema/user");
const Goods = require("../../database/schema/goods");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const { loadXlsx, writeXlsx } = require("../../untils/XlsxSDK");
const { sendTemplate } = require("../../untils/WeixinSDK/index");
const dayjs = require("dayjs");
const { getPasswords } = require("../../untils");
const mongoose = require("mongoose");


class exchangeCardController extends Controller {

  /**
   * @description: 兑换码批量新增
   * @param {type}
   * @return:
   */
  async addSome() {
    const { ctx } = this;
    let query = {};
    const session = await mongoose.startSession();
    session.startTransaction();
    const opts = { session, new: true };
    try {
      const data = ctx.request.body;
      const { count = 1, code = "" } = data;
      const arr = Array(Number(count)).fill({ ...data });
      const random = Math.floor(Math.random() * 10000);
      const result = arr.map((item, index) => {
        const _data = { ...item };
        _data.card = code + Math.floor((+dayjs().format("YYYYMMDDHHmmss")) / 2 + random + index);
        _data.password = getPasswords(8);
        _data.overtime = dayjs(item.overtime).valueOf();
        return _data;
      });

      query = await Model.insertMany(result, opts);
      await session.commitTransaction();
      query = setData(query, "ok", ["updatedAt"]);

      ctx.body = query;
    } catch (error) {
      await session.abortTransaction();
      ctx.logger.error(error);
      ctx.body = doErr(error);
    } finally {
      await session.endSession();
    }
  }

  /**
    * @description: 查找兑换商品
    * @param {type}
    * @return:
    */
  async importData() {
    let query = {};
    const { ctx } = this;
    const session = await mongoose.startSession();
    session.startTransaction();
    const opts = { session, new: true };
    try {
      const data = ctx.request.body;
      const { cardfile, _goods, name, value, _member, overtime } = data;
      const xlsxData = loadXlsx(`./app/${cardfile}`);

      const resultXlsxData = xlsxData[0].data;
      if (resultXlsxData.length > 5001) {
        throw new Error("数据不能超过5000条");
      }
      const arr = [];
      // console.log(resultXlsxData);
      xlsxData[0].data.forEach((item, index) => {
        if (index !== 0) {
          const _data = {};
          _data.name = name;
          _data._goods = _goods;
          _data.value = value;
          _data._member = _member;
          _data.card = item[0];
          _data.password = item[1];
          _data.overtime = dayjs(overtime).valueOf();
          arr.push(_data);
        }
      });

      // console.log(arr);
      // Model.updateOne({ _id: "5f71beaf53e693df6444dcb4" },
      //   { sort: 5 }, opts).exec();
      query = await Model.insertMany(arr, opts);
      await session.commitTransaction();

      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      await session.abortTransaction();
      ctx.logger.error(error);
      ctx.body = doErr(error);
    } finally {
      await session.endSession();
    }
  }
  /**
     * @description: 导出卡号密码
     * @param {type}
     * @return:
     */
  async deriveData() {
    const { ctx } = this;
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;

      // const page = data.pageNum ? data.pageNum - 1 : 0;
      // const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      if (tokenData.isUser !== "1") {
        searchData._member = tokenData._id;
      }

      searchData.isLook = true;

      const result = await Model.find(searchData)
        .sort({
          sort: -1,
          createdAt: -1
        })
        .populate({
          path: "_goods",
        })
        .populate({
          path: "_usegoods",
        })
        .exec();
      const resultArr = [["卡号", "密码"]];
      result.forEach(item => {
        const arr = [item._doc.card, item._doc.password];
        resultArr.push(arr);
      });
      // console.log(resultArr);
      query = await writeXlsx(resultArr, "批量卡号列表");
      // ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
     * @description: 导出位置信息
     * @param {type}
     * @return:
     */
  async deriveAddressData() {
    const { ctx } = this;
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      // const page = data.pageNum ? data.pageNum - 1 : 0;
      // const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      if (tokenData.isUser !== "1") {
        searchData._member = tokenData._id;
      }

      const result = await Model.find(searchData)
        .sort({
          "address.mobile": -1,
          // createdAt: -1
        })
        .populate({
          path: "_goods",
        })
        .populate({
          path: "_usegoods",
        })
        .exec();
      const resultArr = [["商品", "卡号", "收件人", "电话", "地址"]];
      const obj = {};
      result.forEach(item => {
        const arr = [item._doc._usegoods.name, item._doc.card, item._doc.address.people, item._doc.address.mobile, item._doc.address.area.join("") + item._doc.address.mainArea];
        if (!obj[item._doc._usegoods.name]) {
          obj[item._doc._usegoods.name] = 1;
        } else {
          obj[item._doc._usegoods.name] = obj[item._doc._usegoods.name] + 1;
        }
        resultArr.push(arr);
      });
      resultArr.unshift(["详情"]);
      resultArr.unshift([]);
      Object.keys(obj).forEach(item => resultArr.unshift([item, obj[item]]));
      resultArr.unshift(["商品", "数量"]);
      resultArr.unshift(["汇总"]);
      // console.log(obj);
      query = await writeXlsx(resultArr, "发货清单列表");
      // ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
   * @description: 分页带商品
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
      // console.log(data);
      if (data["address.mobile"] === "") {
        delete data["address.mobile"];
      }
      if (data["address.people"] === "") {
        delete data["address.people"];
      }
      // console.log(data);
      const page = data.pageNum ? data.pageNum - 1 : 0;
      const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      searchData.isLook = true;
      // console.log(searchData);
      if (tokenData.isUser !== "1") {
        searchData._member = tokenData._id;
      }

      const skip = page * count;

      const r1 = await Model.find(searchData).limit(count).skip(skip)
        .sort({
          createdAt: -1
        })
        .populate({
          path: "_goods",
        })
        .populate({
          path: "_usegoods",
        })
        .exec();
      const r2 = await Model.countDocuments(searchData).exec();
      query = {
        list: r1,
        total: r2
      };
      // ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }
  /**
    * @description: 兑换商品
    * @param {type}
    * @return:
  */
  async exchange() {
    const { ctx } = this;
    let query = {};
    const session = await mongoose.startSession();
    session.startTransaction();
    const opts = { session, new: true };
    try {
      const data = ctx.request.body;
      if (+data.status !== 1) {
        throw new Error("卡券异常");
      }
      const olddata = {
        _id: data._id
      };
      const newdata = {
        exchangeTime: new Date()
      };
      Object.keys(data).forEach(key => newdata[key] = data[key]);
      newdata.status = 2;

      query = await Model.findOneAndUpdate(olddata, newdata, {
        new: true,
        upsert: true,
        runValidators: true,
        ...opts
      }).populate({
        path: "_usegoods"
      });
      const r = await Goods.findOneAndUpdate({ _id: query._usegoods._id }, {
        $inc: {
          num: -1
        }
      }, {
        runValidators: true,
        ...opts
      });
      if (r.num < 0) {
        throw new Error("库存不足");
      }
      await session.commitTransaction();
      const memberData = await User.findOne({ _id: query._member }, "openid").exec();
      if (memberData.openid) {
        sendTemplate({
          templateId: "Nmb_VQNuZMwI3WN2-HnFoFnqQbodskS9vAlGeNI49s8",
          openid: memberData.openid,
          data: {
            "first": {
              "value": "兑换卡兑换成功提醒",
              "color": "#173177"
            },
            "keyword1": {
              "value": query.name,
              "color": "#173177"
            },
            "keyword2": {
              "value": query.card,
              "color": "#173177"
            },
            "keyword3": {
              "value": query._usegoods.name,
              "color": "#173177"
            },
            "keyword4": {
              "value": dayjs(query.overtime).format("YYYY-MM-DD"),
              "color": "#173177"
            },
            "remark": {
              "value": `收件人:${query.address.people}
电话:${query.address.mobile}
地址:${Array.from(new Set(query.address.area)).join("")}${query.address.mainArea}`,
              "color": "#173177"
            }
          }
        });
      }


      ctx.body = setData(query, null);
    } catch (error) {
      await session.abortTransaction();
      ctx.logger.error(error);
      ctx.body = doErr(error);
    } finally {
      await session.endSession();
    }
  }
  /**
    * @description: 查找兑换商品
    * @param {type}
    * @return:
    */
  async getone() {
    let query = {};
    const { ctx } = this;
    try {
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      searchData.isLook = true;
      query = await Model.findOne(searchData)
        .sort({
          createdAt: -1
        }).populate({
          path: "_goods"
        }).exec();
      if (query.status === 1 && query.overtime <= dayjs().valueOf()) {
        throw new Error("兑换券已过期");
      }

      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
    * @description: 通过手机查单号
    * @param {type}
    * @return:
    */
  async getonebymobile() {
    let query = {};
    const { ctx } = this;
    try {
      const data = ctx.request.body;
      const searchData = {
        _member: data._member
      };
      if (data.mobile) {
        searchData["address.mobile"] = data.mobile;
      }
      // console.log(searchData);
      query = await Model.find(searchData)
        .sort({
          exchangeTime: -1
        })
        .populate({
          path: "_goods"
        }).exec();
      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
    * @description: 卡片统计
    * @param {type}
    * @return:
    */

  async statistics() {
    let query = {};
    const { ctx } = this;
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);

      if (tokenData.isUser !== "1") {
        searchData._member = mongoose.Types.ObjectId(tokenData._id);
      }
      // console.log(searchData);
      const r1 = await Model.aggregate()
        .match(searchData)
        .group({
          _id: "$name",
          sumTotal: { $sum: 1 },
          // useTotal: { $sum: "$status" },
          // ids: { $push: "$_id" },
          // statusLen: { $push: "$status" }
        })
        .sort({ _id: -1 });
      const promises = r1.map(item => new Promise(resolve => Model.countDocuments({ name: item._id, status: { $ne: 1 } }).then(r => {
        resolve(r);
      })));

      const r2 = await Promise.all(promises);
      const r3 = r1.map((item, index) => {
        item.useTotal = r2[index];
        item._member = searchData._member;
        return item;
      });
      query = {
        list: r3,
        total: 10
      };
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /**
    * @description: 卡片统计批量
    * @param {type}
    * @return:
    */
  async statisticsUpdate() {
    let query = {};
    const { ctx } = this;
    try {
      const data = ctx.request.body;
      const olddata = {
        name: data.name,
      };
      const newdata = {
      };
      if (data.newName !== data.name) {
        newdata.name = data.newName;
        query = await Model.updateMany(olddata, newdata, {
          runValidators: true
        })
          .exec();
        if (!query.nModified) {
          throw new Error("更新失败");
        }
        olddata.name = data.newName;
      }


      if (data.overtime) {
        newdata.overtime = data.overtime;
        olddata.status = 1;
      }
      if (data.isLook !== undefined) {
        newdata.isLook = data.isLook;
      }
      if (data._goods) {
        newdata._goods = data._goods;
        olddata.status = 1;
      }
      console.log(olddata, newdata);
      query = await Model.updateMany(olddata, newdata, {
        runValidators: true
      })
        .exec();
      // if()
      console.log(query);
      if (!query.nModified) {
        throw new Error("更新失败");
      }

      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }


  /**
    * @description: 批量发货
    * @param {type}
    * @return:
    */

  async orderSend() {
    let query = {};
    const { ctx } = this;
    try {
      const data = ctx.request.body;
      const olddata = {
        _id: {
          $in: data.ids
        }
      };
      const newdata = {
        status: 3
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


  /**
    * @description: 首页统计
    * @param {type}
    * @return:
    */

  async homeStatistics() {
    let query = {};
    const { ctx } = this;
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      // console.log(data);
      if (tokenData.isUser !== "1") {
        searchData._member = mongoose.Types.ObjectId(tokenData._id);
      }
      const r1 = Model.aggregate()
        .match(searchData)
        .group({
          _id: "$name",
        });
      const r2 = Model.countDocuments({
        _member: tokenData._id,
      });
      const r3 = Model.countDocuments({
        _member: tokenData._id,
        status: {
          $ne: 1
        }
      });
      const r4 = Model.countDocuments({
        _member: tokenData._id,
        exchangeTime: {
          $lt: dayjs(dayjs().format("YYYY-MM-DD") + "23:59:59").toDate(),
          $gt: dayjs(dayjs().format("YYYY-MM-DD") + "00:00:00").toDate()
        }
      });
      const r5 = Model.countDocuments({
        _member: tokenData._id,
        exchangeTime: {
          $lt: dayjs(dayjs().add(1, "month").format("YYYY-MM-DD") + "23:59:59").toDate(),
          $gt: dayjs(dayjs().format("YYYY-MM-DD") + "00:00:00").toDate()
        }
      });
      const promises = [r1, r2, r3, r4, r5];

      query = await Promise.all(promises);

      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }
}


module.exports = exchangeCardController;
