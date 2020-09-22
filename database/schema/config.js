/**
 * 配置信息 必用
 */
const mongoose = require('mongoose') //引入Mongoose
const Schema = mongoose.Schema //声明Schema



/* **/
var ConfigSchema = Schema({
  name: {
    type: String,
    required: [true, "名字必须添加"]
  }, //配置名称
  img:{
    type: String,
  },
  value: {
    type: String,
    alias: "myValue"
  }, //配置内容
  type: String, //配置类型
  unit: String, //配置单位
  sort: {
    type: Number,
    default: 0
  }, //排序
  up: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
})


//发布模型
module.exports = mongoose.model("Config", ConfigSchema)