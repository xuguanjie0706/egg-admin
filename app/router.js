"use strict";

/**
 * @param {Egg.Application} app - egg application
 */

// 引入connect
const {
  connect,
} = require("../database/init.js");

module.exports = async app => {

  await connect(app.config.env);

  const { router, controller } = app;
  for (const i in controller) {
    const Gateway = controller[i];
    for (const j in Gateway) {
      if (i === "base") {
        const arr = j.split("And");
        router.post(`/${arr[0]}/${arr[1]}`, Gateway[j]);
      }
      else if (i === "show") {
        router.get(`/${i}/${j}`, Gateway[j]);
      } else {
        router.post(`/${i}/${j}`, Gateway[j]);
      }
    }
  }

  router.get("/", controller.show.index);
};
