const superagent = require("superagent");
const md5 = require("md5");
const xml2js = require("xml2js").parseString;
const appid = "wx45d398e7c87a97f6";
const secret = "f4be67e5288b16599351f29497cbda50";
const access_token = "37_M22M9dVc3ra-Xb1L7v85p1B-23qhCIKrWM640LArd7CUvVdhgAdknSMNzZ4JdcU0hIUdGUN5nGFkDjgNTEfYioifAOFzanzzGaoTgtN8ZjqorXeK2SXlYWlFJY3wW8yV-mNKqOiePCu4vPiaVHZiAHAGSK";

const baseUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
// superagent.get(baseUrl)
//   .end(function (err, res) {
//     if (err) {
//       return console.error(err);
//     }
//     // access_tokens = res.body.access_token;
//     console.log(res.body);
//   });
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

  const base1 = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`;
  // let base1 = `https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token=${access_tokens}`

  const query = await superagent.post(base1).send(body);
  console.log(query);
  return query;
}

/* pc支付的时候调用 */
const getPCPay = async (data = {}) => {
  const base = "https://api.mch.weixin.qq.com/pay/unifiedorder";
  const body = {
    "appid": "wx45d398e7c87a97f6",
    "mch_id": "1580632751",
    "nonce_str": Math.floor(Math.random() * 100000),
    "out_trade_no": data.outTradeNO || "20150806125346",
    "notify_url": "http://pick.yystart.com/weixin/notifyUrlCall",
    "body": "这个是已个",
    "total_fee": 1,
    "product_id": "12235413214070356458058",
    "spbill_create_ip": "127.0.0.1",
    "trade_type": "NATIVE",
    "attach": 123
  };

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


module.exports = {
  getPCPay,
  getOpenid
};
