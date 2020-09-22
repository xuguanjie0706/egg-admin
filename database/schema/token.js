/*
 * @Author: gj.xu 
 * @Date: 2019-09-12 11:50:40 
 * @Last Modified by: gj.xu
 * @Last Modified time: 2019-09-12 11:51:04
 * token信息
 */

const mongoose = require('mongoose') //引入Mongoose
const Schema = mongoose.Schema //声明Schema



var TokenSchema = Schema({
    _user: {
        type: String,
        required: [true, "名字必须添加"]
    },
    token:String,
    up: {
      type: Number,
      default: 0
    } // 排序
}, {
    timestamps: true
})


//发布模型
module.exports = mongoose.model("Token", TokenSchema)