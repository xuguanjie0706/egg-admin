/**
 * 角色信息 必用
 */
const mongoose = require("mongoose"),
    { Schema } = mongoose;
// Schema 结构
const RoleSchema = new Schema({
    name: String, // 名字
    content: Array,
    // auth: [{
    //     _menu:{
    //         type: Schema.Types.ObjectId,
    //         ref: 'Menu'
    //     },
    //     _menulist:[{
    //         type: Schema.Types.ObjectId,
    //         ref: 'Menu'
    //     }]
    // }], //权限
    remarks: String, // 备注
    sort: Number,
    // selectKey: [],
    up: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Role", RoleSchema);
