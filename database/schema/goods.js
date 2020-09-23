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
  },
  _member: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  value: {
    type: String,
  }, // 描述
  price: {
    type: Number,
  },
  sort: {
    type: Number,
    default: 0
  }, // 排序
  up: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});


// 发布模型
module.exports = mongoose.model("Goods", GoodsSchema);
