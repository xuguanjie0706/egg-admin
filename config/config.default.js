/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
// const path = require("path");
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1600325278426_7087";
  config.cors = {
    origin: "*",
    allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH"
  };
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  config.multipart = {
    fileExtensions: [".apk", ".pdf", ".blob", ".doc", "blob", "*", ".xlsx"] // 增加对 apk 扩展名的文件支持
  };

  // config.view = {
  //   root: [
  //     path.join(appInfo.baseDir, "app/view"),
  //     // path.join(appInfo.baseDir, "path/to/another"),
  //   ].join(",")
  // };

  exports.view = {
    defaultViewEngine: "nunjucks",
    mapping: {
      ".html": "nunjucks" // 左边写成.html后缀，会自动渲染.html文件
    },
  };

  config.security = {
    csrf: false,
    domainWhiteList: ["http://localhost:8080"]
    // csrf: {
    //   headerName: 'x-csrf-token',// 自定义请求头
    // }
  };


  return {
    ...config,
    ...userConfig,
  };
};
