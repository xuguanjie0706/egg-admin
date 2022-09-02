/*
 * @Author: xgj
 * @since: 2022-08-30 16:02:09
 * @lastTime: 2022-09-02 00:06:07
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/database/schema/matter.js
 * @message: 
 */
/**
 * 配置信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const MatterSchema = Schema({
  _goods: {
    type: Schema.Types.ObjectId,
    ref: "Goods",
    required: [true, "上传者必须有"]
  },
  price: {
    type: Number,
  },// 买入价格
  mailprice: {
    type: Number,
  },// 定价
  status: {
    type: String,
    enum: ["1", "2"],
    default: "1", //1正常 2:卖出 3:销毁
  },
  _buyOrder: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  _mailOrder: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
  sort: {
    type: Number,
    default: 0
  }, // 排序
}, {
  timestamps: true,
  versionKey: false
});


// 发布模型
module.exports = mongoose.model("Matter", MatterSchema);
