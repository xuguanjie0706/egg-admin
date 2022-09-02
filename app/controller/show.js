/*
 * @Author: xgj
 * @since: 2022-08-30 16:02:09
 * @lastTime: 2022-09-01 21:43:04
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/app/controller/show.js
 * @message: 
 */

"use strict";
const Model = require("../../database/schema/goods");

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
  async f() {
    const { ctx } = this;
    const a = await Model.find()
    ctx.body = {
      code: 0,
      data: a
    };
  }
}


module.exports = ShowController;
