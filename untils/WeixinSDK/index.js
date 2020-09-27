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

// getOpenid("051oDU0w3PoH2V2gSv0w3qPZiS2oDU0B");
const getOpenid = (code) => {
  const appid = "wx45d398e7c87a97f6";
  const secret = "f4be67e5288b16599351f29497cbda50";

  const base = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
  return new Promise((resolve, reject) => superagent(base).then(r => {
    console.log(r);
    // if (r.body.errcode) {
    //   reject(r.body.errmsg);
    // }

    resolve(r.body);
  }));
};


module.exports = {
  getPCPay,
  getOpenid
};
