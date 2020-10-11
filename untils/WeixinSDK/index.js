const superagent = require("superagent");
const md5 = require("md5");
const xml2js = require("xml2js").parseString;
const dayjs = require("dayjs");
const Member = require("../../database/schema/user");
const PaymentFlow = require("../../database/schema/paymentFlow");
const appid = "wx45d398e7c87a97f6";
const secret = "f4be67e5288b16599351f29497cbda50";
let accessToken = "37_M22M9dVc3ra-Xb1L7v85p1B-23qhCIKrWM640LArd7CUvVdhgAdknSMNzZ4JdcU0hIUdGUN5nGFkDjgNTEfYioifAOFzanzzGaoTgtN8ZjqorXeK2SXlYWlFJY3wW8yV-mNKqOiePCu4vPiaVHZiAHAGSK";

const baseUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;

function getAccessToken() {
  superagent.get(baseUrl)
    .end(function (err, res) {
      if (err) {
        return console.error(err);
      }
      accessToken = res.body.access_token;
      console.log(res.body);
    });
}
getAccessToken();
setInterval(() => {
  getAccessToken();
}, 2 * 60 * 60 * 1000);

const key = "7ba9aa8144e52d5412394fedfef538ce";
/**
 * @description:  发送模板
 * @param {type}
 * @return:{ errcode: 0, errmsg: 'ok', msgid: 1536859103703187500 }
 * @example sendTemplate({
  templateId: "Nmb_VQNuZMwI3WN2-HnFoFnqQbodskS9vAlGeNI49s8",
  openid: "oxoI3wNABfuwiqM5k-ZYmkuFf5lE",
  data: {
    "first": {
      "value": "积分兑换成功提醒",
      "color": "#173177"
    },
    "keyword1": {
      "value": "积分兑换10元劵" || 3,
      "color": "#173177"
    },
    "keyword2": {
      "value": "886065F18C44E9" || 3,
      "color": "#173177"
    },
    "keyword3": {
      "value": "10元劵" || 2,
      "color": "#173177"
    },
    "keyword4": {
      "value": 2,
      "color": "#173177"
    },
    "remark": {
      "value": "1231",
      "color": "#173177"
    }
  }
});
 */

async function sendTemplate({ templateId, openid, data }) {
  const body = {
    touser: openid,
    "template_id": templateId,
    data: data
  };

  const base1 = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;
  const query = await superagent.post(base1).send(body);
  return query;
}


/**
 * @description:  查询订单
 * @param {type}
 * @return:{ errcode: 0, errmsg: 'ok', msgid: 1536859103703187500 }
 * @example
 * *
 */

async function searchPayOrder() {

}

/* pc支付的时候调用 */
const getPCPay = async ({ _card, _member, price, desc }) => {
  const base = "https://api.mch.weixin.qq.com/pay/unifiedorder";
  const tradeNo = dayjs().format("YYYYMMDDHHmmss") + Math.floor(Math.random() * 10000);
  const body = {
    "appid": "wx45d398e7c87a97f6",
    "mch_id": "1580632751",
    "nonce_str": Math.floor(Math.random() * 100000),
    "out_trade_no": tradeNo,
    "notify_url": "http://pick.yystart.com/weixin/notifyUrlCall",
    "body": desc,
    "total_fee": price,
    "product_id": _card,
    "spbill_create_ip": "127.0.0.1",
    "trade_type": "NATIVE",
    "attach": _member
  };
  // console.log(body.out_trade_no);

  const sortArr = Object.keys(body).sort();
  let plain = "";
  sortArr.forEach(item => {
    plain += item + "=" + body[item] + "&";
  });
  plain += "key=" + key;
  const sign = md5(plain).toUpperCase();
  let formData = "<xml>";
  sortArr.forEach(item => {
    formData += `<${item}>${body[item]}</${item}>`;
  });
  formData += "<sign>" + sign + "</sign>"; // 第一次签名的sign
  formData += "</xml>";
  try {
    const query = await superagent.post(base).send(formData);
    const r = await new Promise(resolve => {
      xml2js(query.text, {
        explicitArray: false
      }, function (err, result) {
        if (!err) {
          // 打印解析结果
          resolve(result.xml);
        } else {
          // 打印错误信息
          throw new Error(JSON.stringify(err));
        }
      });
    });
    if (r.return_code === "SUCCESS") {
      const paymentFlow = new PaymentFlow();
      paymentFlow.name = body.out_trade_no;
      paymentFlow._member = _member;
      paymentFlow.transactionId = r.prepay_id;
      paymentFlow.price = price;
      paymentFlow.save();
    }

    return r;
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description:  静默获取openid
 * @param {type}
 * @return:{ errcode: 0, errmsg: 'ok', msgid: 1536859103703187500 }
 * @example
 */
const getOpenid = async (code) => {
  const appid = "wx45d398e7c87a97f6";
  const secret = "f4be67e5288b16599351f29497cbda50";

  const base = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
  try {
    const { text } = await superagent(base);
    // const { openid, errcode } = JSON.parse(text);
    // if (errcode) {
    //   throw new Error("系统错误码为" + errcode);
    // }
    return JSON.parse(text);
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description:  会员续费
 * @param {type}
 * @return:{ errcode: 0, errmsg: 'ok', msgid: 1536859103703187500 }
 * @example
 */
// Member.findOneAndUpdate({
//   _id: "5f6ae297dc627b3fd52ddf64"
// }, {
//   $inc: {
//     overtime: 365 * 60 * 60 * 1000 * 24
//   },
//   status: true
// }, {
//   new: true,
//   upsert: true,
//   runValidators: true
// }).then(r => {
//   console.log(r);
//   console.log(dayjs(r.overtime).format("YYYY-MM-DD HH:mm:ss"));
// });

async function renewMember({ _member, name }) {

  const { overtime } = await Member.findOne({ _id: _member });
  const today = dayjs().valueOf();
  const olddata = overtime > today ? {
    $inc: {
      overtime: 365 * 60 * 60 * 1000 * 24
    },
    status: true
  } :
    {
      $inc: {
        overtime: today + 365 * 60 * 60 * 1000 * 24
      },
      status: true
    };

  const r = await Member.findOneAndUpdate({
    _id: _member
  }, olddata, {
    new: true,
    // upsert: true,
    runValidators: true
  }).exec();
  PaymentFlow.findOneAndUpdate({
    name
  }, {
    status: true
  }, {
    new: true,
    upsert: true,
    runValidators: true
  }).exec();
  return r;
}


module.exports = {
  getPCPay,
  getOpenid,
  renewMember,
  sendTemplate,
};
