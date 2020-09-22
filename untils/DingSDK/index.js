const superagent = require("./node_modules/superagent");

const AppKey = "dingaubayimz3axnhbm3";
const AppSecret =
  "XnS35sleb5Z6p_qKfOkzQAl_Y2ijVtKEkMCsmFLBy9FYXxyir1S0PYQvIIxWoBvg";

const agentId = "318122707";
const corpId = "dingb71abf0f076984f535c2f4657eb6378f";

let access_token = "";

// 获取token
function getAccessToken() {
  const url = `https://oapi.dingtalk.com/gettoken?appkey=${AppKey}&appsecret=${AppSecret}`;
  superagent(url).then(r => {
    access_token = r.body.access_token;
  });
}

getAccessToken();

function getTicket() {
  const base = `https://oapi.dingtalk.com/get_jsapi_ticket?access_token=${access_token}`;
  return new Promise((resolve, reject) => {
    superagent(base).then(r => {
      if (r.body.errcode === 0) {
        resolve(r.body.ticket);
      } else {
        reject();
      }
    });
  });
}

function getUserid(code) {
  const base = `https://oapi.dingtalk.com/user/getuserinfo?access_token=${access_token}&code=${code}`;
  return new Promise((resolve, reject) => {
    superagent(base).then(r => {
      if (r.body.errcode === 0) {
        resolve(r.body);
      } else {
        reject();
      }
    });
  });
}

function sendNotice(userid, data) {
  console.log(userid, data);
  let base = `https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=${access_token}`;
  return new Promise((resolve, reject) => {
    let body = {
      agent_id: agentId,
      userid_list: userid || "064903091735047304",
      msg: {
        msgtype: "oa",
        oa: {
          pc_message_url: "http://localhost:4000/#/room/examine/list",
          // message_url: "http://dingtalk.com",
          head: {
            bgcolor: "FFBBBBBB",
            text: "头部标题"
          },
          body: {
            title: "有新的结算需要您来审核",
            form: [
              {
                key: "订单",
                value: data.orders.toString()
              }
            ]
          }
        }
      }
    };
    superagent
      .post(base)
      .send(body)
      .then(r => {
        if (r.body.errcode === 0) {
          resolve(r.body);
        } else {
          reject();
        }
      });
  });
}

module.exports = {
  AppKey,
  AppSecret,
  agentId,
  corpId,
  access_token,
  getTicket,
  getUserid,
  sendNotice
};
