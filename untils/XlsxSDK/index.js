const xlsx = require("node-xlsx"); // excel 导出
const fs = require("fs");
const dayjs = require("dayjs");

function loadXlsx(url) {
  return xlsx.parse(url);
}

function writeXlsx(data) {
  const buffer = xlsx.build([{
    name: "sheet",
    data
  }]);
  const url = `public/xlsx/${dayjs().format("YYYYMMDD")}.xlsx`;
  return new Promise(resolve => {
    fs.writeFile(`./app/${url}`, buffer, function (err) {
      if (err) {
        throw new Error("导出失败");
        // doErr(err);
      }
      resolve(url);
    });
  });
}


module.exports = {
  loadXlsx,
  writeXlsx
};
