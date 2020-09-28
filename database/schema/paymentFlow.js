/**
 * 支付流水 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const PaymentFlowSchema = Schema({
  name: {
    type: String,
    required: [true, "名字必须添加"]
  }, // 配置名称
  transactionId: String,
  _member: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  price: {
    type: Number,
  },
  status: {
    type: Boolean,
    default: false
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

PaymentFlowSchema.index({
  name: 1
}, {
  unique: true
});

// 发布模型
module.exports = mongoose.model("PaymentFlow", PaymentFlowSchema);
