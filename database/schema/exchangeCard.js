/**
 * 配置信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const ExchangeCardSchema = Schema({
  name: {
    type: String,
    required: [true, "名字必须添加"]
  }, // 名称
  img: {
    type: String,
  },
  value: {
    type: String,
  }, // 描述
  price: {
    type: Number,
    required: [true, "价格必须有"]
  },
  _member: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "上传者必须有"]
  },
  _goods: [{
    type: Schema.Types.ObjectId,
    ref: "Goods",
    required: [true, "兑换商品必须填"]
  }],
  card: {
    type: String,
    required: [true, "卡号必须填"]
  }, // 描述
  password: {
    type: String,
    required: [true, "密码必须填"]
  }, // 描述
  status: {
    type: String,
    enum: ["0", "1"],
    default: "1" // 0 已使用 1 未使用
  },
  overtime: {
    type: Number,
    required: [true, "过期时间必须填"]
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


ExchangeCardSchema.index({
  card: 1
}, {
  unique: true,
  sparse: true
});

// 发布模型
module.exports = mongoose.model("ExchangeCard", ExchangeCardSchema);
