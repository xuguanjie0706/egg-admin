/*
 * @Author: xgj
 * @since: 2022-08-30 16:02:09
 * @lastTime: 2022-09-02 00:33:31
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/app/controller/home.js
 * @message: 
 */
"use strict";

const { Controller } = require("egg");
const Matter = require("../../database/schema/matter");
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const allMatter = await Matter.countDocuments()
    const mailMatter = await Matter.countDocuments({ status: "2" })
    // const allMatter = await Matter.countDocuments()
    ctx.body = "hi, egg";
  }
}

module.exports = HomeController;
