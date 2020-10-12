/*
 * @Author: xgj
 * @since: 2020-09-25 23:19:49
 * @lastTime: 2020-10-12 22:22:33
 * @LastAuthor: xgj
 * @FilePath: /egg/app/controller/show.js
 * @message:
 */

"use strict";
// const Model = require("../../database/schema/role");
const User = require("../../database/schema/user");
const Role = require("../../database/schema/role");
const { getPCPay } = require("../../untils/WeixinSDK");
const { Controller } = require("egg");

// getPCPay();
// async function a() {
//   const users = await User.find({
//     overtime: {
//       $lt: new Date().valueOf()
//     },
//     isUser: 2
//   }).exec();
//   console.log(users);
// }
// a();

class ShowController extends Controller {

  /**
  * @description:  角色列表
  * @param {type}
  * @return:
  */
  async index() {
    const { ctx } = this;
    const query = {};
    await ctx.render("index");
    // ctx.body = "123";
    // ctx.body = "<script>location.herf ='http://pick.yystart.com/#/admin' </script>";
  }

  async a() {
    const { ctx } = this;
    ctx.body = 123;
    // await ctx.render("a.html");
  }


}


module.exports = ShowController;
