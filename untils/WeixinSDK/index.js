const superagent = require("superagent");

const base = "https://api.mch.weixin.qq.com/v3/pay/transactions/native";
// const base = "http://127.0.0.1:7001/user/getone";
const getPCPay = async () => {
  const body = {
    appid: "wx45d398e7c87a97f6",
    mchid: "1580632751",
    description: "123",
    "out_trade_no": "12313212",
    "notify_url": "http://baidu.com",
    amount: {
      total: 1,
    }
  };
  superagent.post(base).send(body).then(r => {
    console.log(r);
  });
};

const appid = "";
const secret = "";
function getAccessToken(code) {
  const base = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;

}


module.exports = {
  getPCPay
};
