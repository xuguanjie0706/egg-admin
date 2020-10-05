const { Subscription } = require("egg");
const User = require("../../database/schema/user");
const Role = require("../../database/schema/role");
class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: "1h", // 1 分钟间隔
      type: "all", // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    try {
      const role = await Role.findOne({ name: "未激活商户" }).exec();
      if (!role) {
        throw new Error("权限不存在");
      }
      // console.log(role);
      // console.log(new Date().valueOf());
      // const r = await User.find({
      //   overtime: {
      //     $lt: new Date().valueOf()
      //   },
      //   isUser: 2
      // });
      // console.log(r, 123);
      const users = await User.updateMany({
        overtime: {
          $lt: new Date().valueOf()
        },
        isUser: "2"
      }, {
        _role: [role._id],
        status: false
      }, {
        new: true
      }).exec();
      console.log(users);
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = UpdateCache;
