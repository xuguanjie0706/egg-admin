const QcloudSms = require("qcloudsms_js"); //腾讯云SDK


//腾讯云短信发送
var appid = 1400120610;
var appkey = "ecb564185c1605da3c405984f1391e61";
var templId = 187989;
var qcloudsms = QcloudSms(appid, appkey);
var smsSign = "大郑网络";



function getCodeTX(phone) {
  let data = phone
  let a = Math.round((Math.random() * 0.9 + 0.0999) * 10000)
  var params = []
  params.push(a)
  var ssender = qcloudsms.SmsSingleSender();
  return new Promise((resolve) => {
    ssender.sendWithParam(86, data, templId,
      params, smsSign, "", "",
      function (err, res, resData) {
        if (err) {
          console.log("err: ", err);
          resolve(err)
        } else {
          console.log("request data: ", res.req);
          resolve(a)
        }
      });
  })

}

const SMSClient = require('@alicloud/sms-sdk') //阿里云

const accessKeyId = 'LTAIQV31LcbglMIM'
const secretAccessKey = 'oc8hgUEE7wlgJ86caASI6cD3is85V4'
let smsClient = new SMSClient({
  accessKeyId,
  secretAccessKey
})




function getCodeAL(phone) {
  let data = phone
  let a = Math.round((Math.random() * 0.9 + 0.0999) * 10000)
  var params = []
  params.push(a)
  return new Promise((resolve, reject) => {
    smsClient.sendSMS({
      PhoneNumbers: Number(data),
      SignName: '学邦教育',
      TemplateCode: 'SMS_172510018',
      TemplateParam: `{"code":${a}}`
    }).then(res => {
      console.log("request data: ", res);
      resolve(a)
    }).catch(err => {
      console.log(err);
    })
  })
}



module.exports = {
  getCodeAL,
  getCodeTX
}