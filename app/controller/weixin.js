"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/user");
const Verification = require("../../database/schema/verification");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const { getPCPay, getOpenid } = require("../../untils/WeixinSDK");
// wx45d398e7c87a97f6
// f4be67e5288b16599351f29497cbda50
class WeiXinController extends Controller {
  async getOpenidWeb() {
    const { ctx } = this;
    const query = {};
    try {
      const data = ctx.request.body;
      const { code, MemberId } = data;
      // console.log(MemberId, code);
      const result = await getOpenid(code);
      if (result.errcode) {
        throw new Error("系统错误码为" + result.errcode);
      }
      console.log(result);
      ctx.body = setData(result, "ok");
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }
}

module.exports = WeiXinController;
