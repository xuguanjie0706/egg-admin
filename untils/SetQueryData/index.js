/*
 * @Author: your name
 * @Date: 2019-12-14 13:32:34
 * @lastTime: 2020-09-18 15:46:56
 * @LastAuthor: xgj
 * @Description: In User Settings Edit
 * @FilePath: /egg/untils/SetQueryData/index.js
 */


const _ = require("lodash");
const dayjs = require("dayjs");

/**
 * @description:
 * @param {err}
 * @return:
 */

function doErr(err) {
  let a;
  if (err.code === "11000") {
    a = {
      code: 3,
      message: "字段已存在",
      data: err
    };
  } else {
    if (err.message) {
      if (err.message === "token失效或不存在") {
        a = {
          code: -1,
          message: err.message,
          data: err
        };
      } else {
        a = {
          code: 2,
          message: (err.errors && err.errors.name && err.errors.name.message) || err.message,
          data: err
        };
      }
    }
  }
  return a;
}


// 设置格式内容
function setData(r, b = "没有数据", t = []) {
  // console.log(r);

  if (checkedType(r) === "Number") {
    return {
      code: 0,
      message: "ok",
      data: r
    };
  }

  const isArr = checkedType(r) === "Array";

  if (_.isEmpty(r)) {
    return {
      code: 0,
      message: b,
      data: isArr ? [] : null
    };
  } else {
    let newData = null;
    if (isArr) {

      newData = r.map(item => {
        if (t.length > 0) {
          for (const i of t) {
            item._doc[i] = dayjs(item._doc[i]).format("YYYY-MM-DD HH:mm");
          }
        }
        return item._doc || item;
      });
    } else {
      if (t.length > 0) {
        for (const i of t) {
          r._doc[i] = dayjs(r._doc[i]).format("YYYY-MM-DD HH:mm");
        }
      }
      newData = r._doc || r;
    }
    return {
      code: 0,
      message: "ok",
      data: newData
    };
  }
}


// 判断类型
function checkedType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}


/**
 * @description:  搜索筛选
 * @param {type}
 *  { 0: "忽略", 1: "赋值",2:"区间",3:"" }
 * @return:
 */


const filterData = {
  pageNum: 0,
  pageSize: 0,
  name: 1,
  createdAt: 2,
  ids: 2,
  userid: 3
};

/**
 * @description: 判断搜索条件
 * @param {data}  传入对象
 * @return:
 */

function fitlerSearch(data) {
  const searchData = {};
  Object.keys(data).forEach(item => {
    console.log(filterData[item]);
    if (filterData[item] === undefined) {

      searchData[item] = data[item];
    } else if (filterData[item] === 1) {
      searchData[item] = new RegExp(data[item]);
    } else if (filterData[item] === 2) {
      if (item === "ids") {
        searchData["_id"] = {
          $in: data[item]
        };
      } else {
        searchData[item] = {
          $in: data[item]
        };
      }
    }
  });
  return searchData;
}


module.exports = {
  doErr,
  setData,
  checkedType,
  fitlerSearch
  // checkMyToken
};
