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
  imgs: [{
    type: String
  }],
  _member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "所属人必须有"]
  },
  value: {
    type: String,
  }, // 描述
  price: {
    type: Number,
  },
  num: {
    type: Number,
    default: 0,
    min: [0, "库存已清空"]
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

GoodsSchema.index({
  name: 1,
  _member: 1
}, {
  unique: true,
  sparse: true
});


// 发布模型
module.exports = mongoose.model("Goods", GoodsSchema);
