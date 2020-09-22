/*
 * @Author: gj.xu 
 * @Date: 2019-09-12 11:48:55 
 * @Last Modified by: gj.xu
 * @Last Modified time: 2019-09-12 11:49:16
 * 短信验证码
 */

const mongoose = require('mongoose') //引入Mongoose
const Schema = mongoose.Schema //声明Schema



/* **/
var VerificationSchema = Schema({
  phone: String, //联系方式
  num: {
    type: Number,
  }, //验证码
  overtime: Date,
  up: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})


//发布模型
module.exports = mongoose.model("Verification", VerificationSchema)