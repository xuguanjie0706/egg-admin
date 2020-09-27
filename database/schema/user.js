/*
 * @Author: gj.xu
 * @Date: 2019-09-12 11:49:33
 * @Last Modified by: gj.xu
 * @Last Modified time: 2019-09-25 19:43:51
 * 用户信息
 */


const mongoose = require("mongoose"); // 引入Mongoose
const { Schema } = mongoose; // 声明Schema
const dayjs = require("dayjs");

const crypto = require("crypto");

const numValidator = (val) => {
  if (val >= 0) {
    return true;
  }
  return false;
};
const phoneValidator = (val) => {
  if ((/^1[3|4|5|8][0-9]\d{4,8}$/.test(val))) {
    return true;
  }
  return false;
};

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "用户不能为空"]
  }, // 名字
  password: {
    type: String,
    required: [true, "密码不能为空"]
  }, // 密码
  lastLoginAt: {
    type: Date,
    default: Date.now()
  }, // 最后一次登陆时间
  _role: [{
    type: Schema.Types.ObjectId,
    ref: "Role"
  }], // 角色
  // _father: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User"
  // }, // 上级
  // _children: [{
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // }], // 下级
  // _collection: [{
  //   type: Schema.Types.ObjectId,
  //   ref: "Product",
  // }], // 产品收藏
  // _supplier: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Supplier",
  // }, // 供应商
  supplier: {
    code: String,
    name: String
  },
  isUser: {
    type: String,
    enum: ["1", "2", "3"],
    default: "1"
  }, // 默认1后台管理员  商户用户为2 手机为3
  phone: {
    type: String,
    validate: {
      validator: phoneValidator,
      message: "请填写正确的手机号"
    },
  }, // 手机号码
  // isEdit: {
  //   type: Boolean,
  //   default: false
  // }, // 修改权限
  // isDelete: {
  //   type: Boolean,
  //   default: false
  // }, // 删除权限
  status: {
    type: Boolean,
    default: false
  }, // 是否会员
  overtime: {
    type: Number,
    default: dayjs().add(1, "year").valueOf()
  },
  openid: String,// 微信服务号 openid
  // unionid: String, // 微信 unionid
  // appOpenid: String, // 微信app openid
  // xiaoOpenid: String, // 微信app openid
  // userid: String,// 微信app userid
  headimgurl: String, // 头像
  nickname: String, // 昵称
  // invite: String, // 邀请码
  // total: {
  //   type: Number,
  //   min: 0,
  //   default: 0.00,
  //   get: v => v.toFixed(2),
  //   set: v => v.toFixed(2),
  //   validate: {
  //     validator: numValidator,
  //     message: "金额不能少于0块"
  //   },
  // }, // 总金额
  // balance: {
  //   type: Number,
  //   min: 0,
  //   default: 0.00,
  //   get: v => v.toFixed(2),
  //   set: v => v.toFixed(2),
  //   validate: {
  //     validator: numValidator,
  //     message: "金额不能少于0块"
  //   },
  // }, // 余额
  // up: {
  //   type: Number,
  //   default: 0
  // }, // 是否置顶
  // company: String,// 企业名称
  // trueName: String,// 真实姓名
  // manufacturer: {
  //   type: Number,
  //   enum: [1, 2],
  // },
  // mail: String,// 邮箱
  isUsed: {
    type: String,
    enum: ["0", "1"],
    default: "1" // 0禁用 1 启用
  }
}, {
  timestamps: true
});

// 定义加密密码计算强度·
const SALT_WORK_FACTOR = 10;

// 每次存储数据时都要执行
// UserSchema.pre('save', function (next, done) {
//   var md5 = crypto.createHash('md5');
//   this.password = md5.update(this.password).digest('hex');
//   next()
// })

// UserSchema.pre("updateOne",function(next,done){
//   var md5 = crypto.createHash('md5');
//   this.password = md5.update(this.password).digest('hex');
//   next()
// })

// UserSchema.post('findOneAndUpdate', function (data, next) {
//   // console.log(data.invite);
//   // if(data.invite){

//   // }
//   // UserSchema.findById(data).then(r=>{
//   //   console.log(r);

//   // })
//   this.findOne(data).then(r => { console.log(r); })
//   next()
// })


// UserSchema.post("save", function (data, next) {
//   // this.id =  this._id
//   // console.log(data, '后置钩子')
//   next()
// })


// UserSchema.statics.findByInvite = function (invite, cb) {
//   return this.findOne({
//     invite: invite
//   }, cb);
// };


// UserSchema.statics.checkedInvite = function (invite, cb) {
//   return this.countDocuments({
//     invite: invite
//   }, cb);
// };


UserSchema.index({
  name: 1
}, {
  unique: true
});

UserSchema.index({
  phone: 1
}, {
  unique: true,
  sparse: true
});

UserSchema.index({
  openid: 1
}, {
  unique: true,
  sparse: true
});


// UserSchema.index({
//   invite: 1
// }, {
//   unique: true,
//   sparse: true
// });


// UserSchema.index({
//   xiaoOpenid: 1
// }, {
//   unique: true,
//   sparse: true
// });

// UserSchema.index({
//   unionid: 1
// }, {
//   unique: true,
//   sparse: true
// });


UserSchema.index({
  xiaoOpenid: 1
}, {
  unique: true,
  sparse: true
});

UserSchema.index({
  userid: 1
}, {
  unique: true,
  sparse: true
});


// UserSchema.index({
//   _supplier: 1
// }, {
//   unique: true,
//   sparse: true
// });


// 发布模型
module.exports = mongoose.model("User", UserSchema);
