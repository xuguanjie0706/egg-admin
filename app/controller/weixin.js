"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/user");
const Verification = require("../../database/schema/verification");
const Config = require("../../database/schema/config");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const { getPCPay, getOpenid, sendTemplate, renewMember } = require("../../untils/WeixinSDK");
const dayjs = require("dayjs");
const xml2js = require("xml2js").parseString;
// wx45d398e7c87a97f6
// f4be67e5288b16599351f29497cbda50

class WeiXinController extends Controller {
  /**
  * @description:  绑定微信openId
  * @param {type}
  * @return:{ errcode: 0, errmsg: 'ok', msgid: 1536859103703187500 }
  * @example
  */
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
  /**
   * @description:  发送模板
   * @param {type}
   * @return:{ errcode: 0, errmsg: 'ok', msgid: 1536859103703187500 }
   * @example   {
      appid: 'wx45d398e7c87a97f6',
      attach: '5f6480b6a18e5a1a7e86721f',
      bank_type: 'CMB_CREDIT',
      cash_fee: '1',
      fee_type: 'CNY',
      is_subscribe: 'Y',
      mch_id: '1580632751',
      nonce_str: '98418',
      openid: 'oxoI3wNABfuwiqM5k-ZYmkuFf5lE',
      out_trade_no: '20200927224561',
      result_code: 'SUCCESS',
      return_code: 'SUCCESS',
      sign: 'B1EE67A19DFF8232CF197978D97E8F6A',
      time_end: '20200927224353',
      total_fee: '1',
      trade_type: 'NATIVE',
      transaction_id: '4200000768202009275015684668'
    }
   */

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

      const memberData = await renewMember({ _member: r.attach, name: r.out_trade_no });
      if (memberData.openid) {
        sendTemplate({
          templateId: "bqlamfGVW2uAet2mqv7m7PGNdBeucwpzkSZBUGiNCxA",
          openid: memberData.openid,
          data: {
            "first": {
              "value": "续费成功",
              "color": "#173177"
            },
            "keyword1": {
              "value": memberData.name,
              "color": "#173177"
            },
            "keyword2": {
              "value": "1年",
              "color": "#173177"
            },
            "keyword3": {
              "value": (r.total_fee / 100).toFixed(2) + "元",
              "color": "#173177"
            },
            "keyword4": {
              "value": dayjs(memberData.overtime).format("YYYY-MM-DD"),
              "color": "#173177"
            },
            "remark": {
              "value": "欢迎您成为会员",
              "color": "#173177"
            }
          }
        });
      }

      console.log(r);
      // console.log(ctx, 33);
      // console.log(ctx.request, 12);
      ctx.body = `<xml><return_code><![CDATA[SUCCESS]]></return_code>
      <return_msg><![CDATA[OK]]></return_msg></xml>`;
      // const data = ctx.request.body;
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
