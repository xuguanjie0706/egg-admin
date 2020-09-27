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
      console.log(data);
      const { code, MemberId } = data;
      if (!code || !MemberId) {
        throw new Error("参数不对");
      }
      // console.log(MemberId, code);
      const { errcode, openid } = await getOpenid(code);
      if (errcode) {
        throw new Error("系统错误码为" + errcode);
      }
      const query = await Model.updateOne({ _id: MemberId }, { openid });
      console.log(query);
      ctx.body = setData(query, "ok");
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }
}

module.exports = WeiXinController;
