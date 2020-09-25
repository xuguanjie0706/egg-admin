"use strict";

const { Controller } = require("egg");
const Model = require("../../database/schema/user");
const Verification = require("../../database/schema/verification");
const { doErr, fitlerSearch, setData } = require("../../untils/SetQueryData/index");
const { getToken, checkToken } = require("../../untils/TokenSDK/index");
// wx45d398e7c87a97f6
// f4be67e5288b16599351f29497cbda50
class WeiXinController extends Controller {

}

module.exports = WeiXinController;
