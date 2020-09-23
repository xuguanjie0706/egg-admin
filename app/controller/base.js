"use strict";

const { Controller } = require("egg");
const mongoose = require("mongoose");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { checkToken } = require("../../untils/TokenSDK/index");
const {
  initSchemas
} = require("../../database/init.js");
const _ = require("lodash");

initSchemas();


class BaseController extends Controller {

}

for (const i in mongoose.models) {
  const Model = mongoose.models[i];

  BaseController.prototype[`${_.camelCase(i)}And${"editoradd"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);

      if (!tokenData) {
        throw new Error("token失效或不存在");
      }

      if (_.camelCase(i) === "user" && tokenData.isUser !== "1") {
        throw new Error("权限不足");
      }
      const data = ctx.request.body;

      const newdata = data._id ? {} : new Model();

      const olddata = data._id ? {
        _id: data._id
      } : {
          _id: newdata._id
        };
      delete data._id;
      Object.keys(data).forEach(key => newdata[key] = data[key]);
      query = await Model.findOneAndUpdate(olddata, newdata, {
        new: true,
        upsert: true,
        runValidators: true
      });
      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };
  BaseController.prototype[`${_.camelCase(i)}And${"pagesimple"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;

      const page = data.pageNum ? data.pageNum - 1 : 0;
      const count = data.pageSize ? Number(data.pageSize) : 10;
      const searchData = fitlerSearch(data);
      const skip = page * count;

      const r1 = await Model.find(searchData).limit(count).skip(skip).sort({
        sort: -1,
        createdAt: -1
      }).exec();
      const r2 = await Model.countDocuments(searchData).exec();
      query = {
        list: r1,
        total: r2
      };
      // ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
      ctx.body = setData(query, null);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };

  BaseController.prototype[`${_.camelCase(i)}And${"count"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      query = await Model.countDocuments(searchData).exec();
      ctx.body = setData(query);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };

  BaseController.prototype[`${_.camelCase(i)}And${"allbysimple"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      query = await Model.find(searchData).sort({
        sort: -1,
        createdAt: -1
      }).exec();

      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };

  BaseController.prototype[`${_.camelCase(i)}And${"getonebysimple"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      query = await Model.findOne(searchData).sort({
        createdAt: -1
      }).exec();

      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };

  BaseController.prototype[`${_.camelCase(i)}And${"remove"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      if (!((data.ids && data.ids.length > 0) || data._id)) {
        throw new Error("请输入删除条件");
      }
      const searchData = fitlerSearch(data);
      query = await Model.remove(searchData).sort({
        createdAt: -1
      }).exec();

      ctx.body = setData(query);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };

  BaseController.prototype[`${_.camelCase(i)}And${"getsomebysimple"}`] = async (ctx) => {
    let query = {};
    try {
      const { token } = ctx.request.header;
      const tokenData = await checkToken(token);
      if (!tokenData) {
        throw new Error("token失效或不存在");
      }
      const data = ctx.request.body;
      const searchData = fitlerSearch(data);
      query = await Model.find(searchData).sort({
        createdAt: -1
      }).exec();
      ctx.body = setData(query, null, ["createdAt", "updatedAt"]);
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  };


}

module.exports = BaseController;
