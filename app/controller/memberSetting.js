"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/memberSetting");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const dayjs = require("dayjs");
const { getPasswords } = require("../../untils");


class memberSettingController extends Controller {

  /**
   * @description: 兑换码批量新增
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

module.exports = memberSettingController;
