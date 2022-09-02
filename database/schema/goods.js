/*
 * @Author: xgj
 * @since: 2022-08-30 16:02:09
 * @lastTime: 2022-09-01 23:04:19
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/database/schema/goods.js
 * @message: 
 */
/**
 * 配置信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const GoodsSchema = Schema({
  name: {
    type: String,
    required: [true, "名字必须添加"]
  }, // 配置名称
  img: {
    type: String,
  }, //图片
  originalPrice: {
    type: Number,
  },//初始价格
  mailPrice: {
    type: Number,
  }, // 定价
  desc: {
    type: String,
  },// 描述
  specs: {
    type: Number,
  }, //单品数量
  low: {
    type: Number,
  }, // 最低价格
  upper: {
    type: Number,
  }, // 最高价格
  sort: {
    type: Number,
    default: 0
  }, // 排序

}, {
  timestamps: true,
  versionKey: false
});


// 发布模型
module.exports = mongoose.model("Goods", GoodsSchema);
