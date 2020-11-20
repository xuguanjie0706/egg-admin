/**
 * 配置信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const MemberSettingSchema = Schema({
  name: {
    type: String,
    required: [true, "标题必须添加"]
  }, // 配置名称
  img: {
    type: String,
    // required: [true, "图片必须添加"]
  },
  desc: {
    type: String,
    // required: [true, "图片必须添加"]
  },
  phone: {
    type: String,
  },
  _member: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  up: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});


MemberSettingSchema.index({
  _member: 1
}, {
  unique: true
});

// 发布模型
module.exports = mongoose.model("MemberSetting", MemberSettingSchema);
