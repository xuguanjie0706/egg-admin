
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
    ctx.body = 123;
  }

  async a() {
    const { ctx } = this;
    ctx.body = 123;
    // await ctx.render("a.html");
  }


}


module.exports = ShowController;
