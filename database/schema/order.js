/*
 * @Author: xgj
 * @since: 2022-09-01 00:36:19
 * @lastTime: 2022-09-01 23:19:36
 * @LastAuthor: xgj
 * @FilePath: /egg-admin/database/schema/order.js
 * @message: 
 */
/**
 * 配置信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const OrderSchema = Schema({
  _goods: {
    type: Schema.Types.ObjectId,
    ref: "Goods",
    required: [true, "上传者必须有"]
  },
  num: {
    type: Number,
  },//数量
  price: {
    type: Number,
  },//价格
  type: {
    type: String,
    enum: ["1", "2"],
    default: "1" // 1买入 2 卖出
  },
  channel: {
    type: String,
  }
}, {
  timestamps: true,
  versionKey: false
});


// 发布模型
module.exports = mongoose.model("Order", OrderSchema);
