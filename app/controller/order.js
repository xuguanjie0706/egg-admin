/*
 * @Author: xgj
 * @since: 2022-09-01 01:39:03
 * @lastTime: 2022-09-04 13:41:42
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/app/controller/order.js
 * @message: 
 */
"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/order");
const Matter = require("../../database/schema/matter");
const User = require("../../database/schema/user");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const dayjs = require("dayjs");


class OrderController extends Controller {

  /**
   * @description: 兑换码批量新增
   * @param {type}
   * @return:
   */
  async add() {
    const { ctx } = this;
    let query = {};

    try {

      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);

      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const newdata = new Model();
      const olddata = { _id: newdata._id }
      Object.keys(data).forEach(key => newdata[key] = data[key]);
      const order = await Model.findOneAndUpdate(olddata, newdata, {
        new: true,
        upsert: true,
        runValidators: true
      });

      const arr = Array(Number(data.num)).fill(1).map(item => {
        return {
          _buyOrder: order._id,
          _goods: data._goods,
          price: (data.price / data.num).toFixed(2),
        }
      });
      console.log(arr)
      query = await Matter.insertMany(arr);
      ctx.body = setData(query, "ok", ["updatedAt"]);
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
      // console.log(data, "Data")
      const page = data.pageNum ? data.pageNum - 1 : 0;
      const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      searchData._member = tokenData.isUser !== "1" ? tokenData._id : undefined;
      const skip = page * count;

      const r1 = await Model.find(searchData).limit(count).skip(skip)
        .sort({
          sort: -1,
          createdAt: -1
        })
        .populate({
          path: "_goods",
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
  /*
    * @description: 卖出订单
    * @param {type}
    * @return:
    */
  async mail() {
    const { ctx } = this;
    let query = {};

    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      if (!data.num) {
        throw new Error("数量不能为空")
      }
      const newdata = new Model();
      const olddata = { _id: newdata._id }
      Object.keys(data).forEach(key => newdata[key] = data[key]);
      newdata.type = 2
      const order = await Model.findOneAndUpdate(olddata, newdata, {
        new: true,
        upsert: true,
        runValidators: true
      });

      const matter = await Matter.find({ status: "1", _goods: data._goods }).populate({
        path: "_goods",
      }).limit(newdata.num).sort({
        sort: -1,
        createdAt: -1
      })

      matter.map(async (item) => {
        console.log(item._id)
        const a = await Matter.updateOne({
          _id: item._id
        }, {
          status: "2",
          mailprice: item._goods.mailPrice,
          _mailOrder: order._id
        })
        const diffPrice = (item._goods.mailPrice - item.price)
        await User.updateMany({ name: "18079442433" }, {
          $inc: {
            balance: diffPrice * 0.4,
            total: diffPrice * 0.4
          }
        })
        await User.updateMany({ name: "13486843355" }, {
          $inc: {
            balance: diffPrice * 0.3,
            total: diffPrice * 0.3
          }
        })
        await User.updateMany({ name: "13757613664" }, {
          $inc: {
            balance: diffPrice * 0.3,
            total: diffPrice * 0.3
          }
        })
      })
      ctx.body = setData(query, "ok", ["updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

}


module.exports = OrderController;
