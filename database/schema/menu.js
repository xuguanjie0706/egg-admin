/**
 * 菜单信息 必用
 */
const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema


/* **/
const MenuSchema = Schema({
    content: {}
    // name: {
    //     type: String,
    //     required: [true, "名字必须添加"]
    // },
    // _menu: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Menu'
    // }],
    // icon: {
    //     type: String,
    // },
    // url: {
    //     type: String,
    // },
    // type: {
    //     type: Number,
    //     default: 0
    // },
    // _father: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Menu'
    // },
    // up: {
    //     type: Number,
    //     default: 0
    // },
    // sort: {
    //     type: Number,
    //     default: 0
    // }
}, {
    timestamps: true
});


// MenuSchema.index({
//     name: 1
// }, {
//     unique: true
// });


// 发布模型
module.exports = mongoose.model("Menu", MenuSchema);
