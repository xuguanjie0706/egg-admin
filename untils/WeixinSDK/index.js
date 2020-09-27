const superagent = require("superagent");


/* pc支付的时候调用 */
const getPCPay = async (data = {}) => {
  const base = "https://api.mch.weixin.qq.com/v3/pay/transactions/native";
  const body = {
    appid: "wx45d398e7c87a97f6",
    mchid: "1580632751",
    description: "123",
    "out_trade_no": data.outTradeNO || "12313212",
    "notify_url": "http://pick.yystart.com/weixin/notifyUrlCall",
    amount: {
      total: 1,
    }
  };
  try {
    const query = await superagent.post(base).send(body);
    return query;
  } catch (error) {
    console.log(error);
  }
};
// getPCPay();

// getOpenid("051oDU0w3PoH2V2gSv0w3qPZiS2oDU0B");
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
