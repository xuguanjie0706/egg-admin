/*
 * @Author: xgj
 * @since: 2022-08-30 16:02:09
 * @lastTime: 2022-09-04 16:28:34
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/app/controller/show.js
 * @message: 
 */

"use strict";
const Model = require("../../database/schema/goods");
const Matter = require("../../database/schema/matter");
const User = require("../../database/schema/user");

const { Controller } = require("egg");


setTimeout(() => {
  init()
}, 2000);
async function init() {
  const b = await Matter.find({ status: "2" })
  console.log(b)
  const a = await Matter.updateMany({}, { status: "1" })
  console.log(a)

  await User.updateMany({}, {
    balance: 0,
    total: 0
  })
}

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

  async allPrice() {
    const { ctx } = this;

    const matterList = await Model.find()

    const b = await Matter.aggregate().match({
      status: "1"
    }).group({
      _id: "$_goods",
      num: {
        $sum: 1
      },
    })
    let matterObj = {}
    b.forEach(item => {
      matterObj[item._id] = item.num
    })
    matterList.map(item => {
      item._doc.num = matterObj[item._id] || 0
      return item
    })
    ctx.body = {
      code: 0,
      data: matterList
    };
  }
}


module.exports = ShowController;
