const mongoose = require("mongoose");
// const db = "mongodb://129.28.165.95:27017/hello"
// var db = 'mongodb://xu:123abc@122.51.113.201:27017/ding?authSource=admin';
// var db = 'mongodb://xu:123abc@122.51.113.201:20000/ding?authSource=admin';

// var url = 'mongodb://122.51.113.201:20000,122.51.113.201:20001,122.51.113.201:20002/ding'
// var options = {
//   autoIndex: false,
//   replicaSet: 'rs0',
//   readPreference: 'secondary',
//   w: 'majority',
//   user: 'xu',
//   pass: '123abc'
// }
// global.mongoose = mongoose
const glob = require("glob");
const {
  resolve,
} = require("path");
mongoose.Promise = global.Promise;
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, "./schema/", "**/*.js")).forEach(require);
};


exports.connect = (mode = "local") => {

  const db = mode === "local" ? "mongodb://xu:123abc@106.14.182.16:20001/base?authSource=admin" : "mongodb://xu:123abc@106.14.182.16:20001/base?authSource=admin";
  // 连接数据库
  mongoose.connect(db);

  let maxConnectTimes = 0;
  return new Promise((resolve, reject) => {
    // 把所有连接放到这里

    // 增加数据库监听事件
    mongoose.connection.on("disconnected", () => {
      console.log("***********数据库断开***********");
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        db1 = "mongodb://xu:123abc@122.51.113.201:20001/ding?authSource=admin";

        mongoose.connect(db1, {
          useNewUrlParser: true,
        });
      } else {
        reject();
        throw new Error("数据库出现问题，程序无法搞定，请人为修理......");
      }

    });
    mongoose.connection.on("error", err => {
      console.log("***********数据库错误***********");
      if (maxConnectTimes < 3) {
        maxConnectTimes++;
        mongoose.connect(db);
      } else {
        reject(err);
        throw new Error("数据库出现问题，程序无法搞定，请人为修理......");
      }

    });
    // 链接打开的时
    mongoose.connection.once("open", () => {
      console.log("MongoDB connected successfully");
      resolve();
    });
  });
};
