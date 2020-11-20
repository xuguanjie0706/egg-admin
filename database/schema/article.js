/**
 * 文章信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const ArticleSchema = Schema({
  name: {
    type: String,
    required: [true, "名字必须添加"]
  }, // 配置名称
  value: {
    type: String,
  }, // 配置内容
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
module.exports = mongoose.model("Article", ArticleSchema);
