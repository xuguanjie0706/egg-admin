"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/goods");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const dayjs = require("dayjs");


class goodsController extends Controller {
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
      console.log(searchData);
      const skip = page * count;

      const r1 = await Model.find(searchData).limit(count).skip(skip)
        .sort({
          sort: -1,
          createdAt: -1
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


module.exports = goodsController;
