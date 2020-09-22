const xlsx = require("node-xlsx"); // excel 导出
const fs = require("fs");

const Until = require("../untils/doErr");


function loadXlsx(url) {
  return xlsx.parse(url);
}

function writeXlsx(data) {
  const buffer = xlsx.build([{
    name: "sheet",
    data: [data]
  }]);
  fs.writeFile("./public/result.xls", buffer, function (err) {
    if (err)
      Until.doErr(err);
    console.log("Write to xls has finished");
  });
}


module.exports = {
  loadXlsx,
  writeXlsx
};
