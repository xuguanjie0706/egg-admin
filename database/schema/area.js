/**
 * 收货地址信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const AreaSchema = Schema({
  name: {
    type: String,
    // required: [true, "名字必须添加"]
  }, // 配置名称
  mobile: {
    type: String,
    required: [true, "手机号必须添加"]
  },
  province: {
    type: String,
    required: [true, "省必须添加"]
  }, // 省
  city: {
    type: String,
    required: [true, "市必须添加"]
  }, // 市
  area: {
    type: String,
    required: [true, "区必须添加"]
  },
  desc: String, // 详细地址
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
module.exports = mongoose.model("Area", AreaSchema);
