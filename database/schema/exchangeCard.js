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
  code: {
    type: String,
  },
  value: {
    type: String,
  }, // 描述
  price: {
    type: Number,
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
  _usegoods: {
    type: Schema.Types.ObjectId,
    ref: "Goods",
  },
  card: {
    type: String,
    required: [true, "卡号必须填"]
  }, // 描述
  password: {
    type: String,
    required: [true, "密码必须填"]
  }, // 描述
  sendInfo: {
    type: Object,
  },
  address: {
    type: Object,
  },
  _area: {
    type: Schema.Types.ObjectId,
    ref: "Area",
  },
  status: {
    type: String,
    enum: ["1", "2", "3", "4"],
    default: "1" //  1 未使用 2 已兑换 3 已发货 4 已完成
  },
  isLook: {
    type: Boolean,
    default: true
  }, // 是否展示
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
  },
  exchangeTime: {
    type: Date
  }
}, {
  timestamps: true,
  versionKey: false
});


ExchangeCardSchema.index({
  card: 1,
  _member: 1
}, {
  unique: true,
  sparse: true
});

// 发布模型
module.exports = mongoose.model("ExchangeCard", ExchangeCardSchema);
