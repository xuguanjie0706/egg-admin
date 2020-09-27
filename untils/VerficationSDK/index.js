const QcloudSms = require("qcloudsms_js"); // 腾讯云SDK


// 腾讯云短信发送
const appid = 1400120610;
const appkey = "ecb564185c1605da3c405984f1391e61";
const templId = 187989;
const qcloudsms = QcloudSms(appid, appkey);
const smsSign = "大郑网络";


function getCodeTX(phone) {
  const data = phone;
  const a = Math.round((Math.random() * 0.9 + 0.0999) * 10000);
  const params = [];
  params.push(a);
  const ssender = qcloudsms.SmsSingleSender();
  return new Promise((resolve) => {
    ssender.sendWithParam(86, data, templId,
      params, smsSign, "", "",
      function (err, res, resData) {
        if (err) {
          // console.log("err: ", err);
          // resolve(err);
          throw new Error(err);
        } else {
          console.log("request data: ", res.req);
          resolve(a);
        }
      });
  });

}

const SMSClient = require("@alicloud/sms-sdk"); // 阿里云

const accessKeyId = "LTAI4G5U2NVgaVCCV6om7XKj";
const secretAccessKey = "6oFbPMwehwv97hkPqfuo6TJZocl9bO";
const smsClient = new SMSClient({
  accessKeyId,
  secretAccessKey
});

// getCodeAL(18906764747);

function getCodeAL(phone) {
  const data = phone;
  const a = Math.round((Math.random() * 0.9 + 0.0999) * 10000);
  const params = [];
  params.push(a);
  return new Promise((resolve, reject) => {
    smsClient.sendSMS({
      PhoneNumbers: Number(data),
      SignName: "乐隐农业",
      TemplateCode: "SMS_197120312",
      TemplateParam: `{"code":${a}}`
    }).then(res => {
      console.log("request data: ", res);
      resolve(a);
    }).catch(err => {
      console.log(err);
    });
  });
}


module.exports = {
  getCodeAL,
  getCodeTX
};
