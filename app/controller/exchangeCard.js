"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/exchangeCard");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const dayjs = require("dayjs");
const { getPasswords } = require("../../untils");


class exchangeCardController extends Controller {

  /**
   * @description: 兑换码批量新增
   * @param {type}
   * @return:
   */
  async addSome() {
    const { ctx } = this;
    let query = {};

    try {
      const data = ctx.request.body;
      const { count = 1, code = "" } = data;
      const arr = Array(Number(count)).fill({ ...data });
      const result = arr.map(item => {
        const _data = { ...item };
        _data.card = code + Math.floor((+dayjs().format("YYYYMMDDHHmmss")) / 2 + Math.floor(Math.random() * 1000));
        _data.password = getPasswords(8);
        _data.overtime = dayjs().add(1, "year").valueOf();
        return _data;
      });
      query = await Model.insertMany(result);

      query = setData(query, "ok", ["updatedAt"]);

      ctx.body = query;
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

      const page = data.pageNum ? data.pageNum - 1 : 0;
      const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      if (tokenData.isUser !== "1") {
        searchData._member = tokenData._id;
      }
      const skip = page * count;

      const r1 = await Model.find(searchData).limit(count).skip(skip)
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
    * @description: 分页带商品
    * @param {type}
    * @return:
  */
  async exchange() {
    const { ctx } = this;
    let query = {};
    try {
      const data = ctx.request.body;
      if (+data.status !== 1) {
        throw new Error("卡券异常");
      }
      const olddata = {
        _id: data._id
      };
      const newdata = {
      };
      Object.keys(data).forEach(key => newdata[key] = data[key]);
      newdata.status = 2;
      query = await Model.updateOne(olddata, newdata, {
        new: true,
        upsert: true,
        runValidators: true
      });
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  async getone() {
    let query = {};
    const { ctx } = this;
    try {
      const { token } = ctx.request.header;
      // const tokenData = await checkToken(token);
      // if (!tokenData) {
      //   throw new Error("token失效或不存在");
      // }
      const data = ctx.request.body;
      console.log(data);
      const searchData = fitlerSearch(data);
      query = await Model.findOne(searchData)
        .sort({
          createdAt: -1
        }).populate({
          path: "_goods"
        }).exec();

      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

}


module.exports = exchangeCardController;
