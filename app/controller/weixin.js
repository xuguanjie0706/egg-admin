"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/user");
const Verification = require("../../database/schema/verification");
const Config = require("../../database/schema/config");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const { getPCPay, getOpenid, sendTemplate } = require("../../untils/WeixinSDK");
const xml2js = require("xml2js").parseString;
// wx45d398e7c87a97f6
// f4be67e5288b16599351f29497cbda50

class WeiXinController extends Controller {
  async getOpenidWeb() {
    const { ctx } = this;
    let query = {};
    try {
      const data = ctx.request.body;
      const { code, MemberId } = data;
      if (!code || !MemberId) {
        throw new Error("参数不对");
      }
      const { errcode, openid } = await getOpenid(code);
      if (errcode) {
        throw new Error("系统错误码为" + errcode);
      }
      query = await Model.updateOne({ _id: MemberId }, { openid });
      // console.log(query);
      ctx.body = setData(query, "ok");
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }


  async getPayWeb() {
    const { ctx } = this;
    const query = {};
    try {
      const data = ctx.request.body;
      const { _member } = data;
      const { value: money } = await Config.findOne({ name: "年费" });

      const r = await getPCPay({
        _card: "1232326176217",
        _member,
        price: money || 1,
        desc: "会员充值"
      });
      if (r.result_code !== "SUCCESS") {
        throw new Error(r.return_msg);
      }
      // if (errcode) {
      //   throw new Error("系统错误码为" + errcode);
      // }
      // query = await Model.updateOne({ _id: MemberId }, { openid });
      // console.log(query);
      ctx.body = setData(r.code_url, "ok");
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  async notifyUrlCall() {
    const { ctx } = this;
    const query = {};
    try {
      const buffer = [];
      ctx.req.on("data", r => {
        buffer.push(r);
      });
      const msgXmlResult = await new Promise((resolve, reject) => {
        ctx.req.on("end", r => {
          const msgXml = Buffer.concat(buffer).toString("utf-8");
          // console.log(msgXml)
          resolve(msgXml);

        });
      });
      const r = await new Promise((resolve, reject) => {
        xml2js(msgXmlResult, {
          explicitArray: false
        }, function (err, result) {
          if (!err) {
            // 打印解析结果
            resolve(result.xml);
          } else {
            // 打印错误信息
            console.log(err);
          }
        });
      });
      console.log(r);
      console.log(ctx, 33);
      console.log(ctx.request, 12);

      const data = ctx.request.body;
      // console.log(data);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  async payCall() {
    const { ctx } = this;
    const query = {};
    try {
      const data = ctx.request.body;
      console.log(data, 123121);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }


}

module.exports = WeiXinController;
