/*
 * @Author: xgj
 * @since: 2022-09-01 01:39:03
 * @lastTime: 2022-09-01 23:39:40
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/app/controller/matter.js
 * @message: 
 */
"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/matter");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const dayjs = require("dayjs");


class MatterController extends Controller {
  /**
   * @description: 分页带商品
   * @param {type}
   * @return:
   */
  async page() {
    const { ctx } = this;
    let query = {};
    try {
      console.log(123)
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

}


module.exports = MatterController;
