
"use strict";
// const Model = require("../../database/schema/role");
const User = require("../../database/schema/user");
const Role = require("../../database/schema/role");
const { Controller } = require("egg");


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
