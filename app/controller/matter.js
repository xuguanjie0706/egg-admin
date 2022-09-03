/*
 * @Author: xgj
 * @since: 2022-09-01 01:39:03
 * @lastTime: 2022-09-03 15:37:15
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/app/controller/matter.js
 * @message: 
 */
"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/matter");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
const dayjs = require("dayjs");


class MatterController extends Controller {
  /**
   * @description: 分页带商品
   * @param {type}
   * @return:
   */
  async page() {
    const { ctx } = this;
    let query = {};
    try {
      console.log(123)
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      // console.log(data, "Data")
      const page = data.pageNum ? data.pageNum - 1 : 0;
      const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      searchData._member = tokenData.isUser !== "1" ? tokenData._id : undefined;
      const skip = page * count;

      const r1 = await Model.find(searchData).limit(count).skip(skip)
        .sort({
          sort: -1,
          createdAt: -1
        })
        .populate({
          path: "_goods",
        })
        .exec();
      const r2 = await Model.countDocuments(searchData).exec();
      query = {
        list: r1,
        total: r2
      };
      // ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  /*
   * @description: 卖出订单
   * @param {type}
   * @return:
   */
  async allPrice() {
    const { ctx } = this;
    // const a = await Model.find()
    const matter = await Model.aggregate().match({
      status: "1"
    }).lookup({
      from: "goods",
      localField: "_goods",
      foreignField: "_id",
      as: "goodModal"
    })
      .group({
        _id: "$status",
        allprice: {
          $sum: "$price",
        }, //总库存价格
        allnum: {
          $sum: 1,
        },//总库存数量
      })
    const matter1 = await Model.aggregate().match({})
      .group({
        _id: "sort",
        allbuyprice: {
          $sum: "$price",
        },//总买入价格
        allbuynum: {
          $sum: 1,
        }//总数量
      })

    const matter2 = await Model.find({ status: "1" }).populate({ path: "_goods" })
    console.log(matter2)
    const allmailpirce = matter2.reduce((x, y) => x + y._doc._goods.mailPrice, 0)

    ctx.body = {
      code: 0,
      data: { ...matter[0], ...matter1[0], allmailpirce }
      // data: matter2
    };
  }

}


module.exports = MatterController;
