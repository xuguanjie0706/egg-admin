"use strict";

const { Controller } = require("egg");
const path = require("path");
// const fs = require('mz/fs');
const fs = require("fs-extra");
const dayjs = require("dayjs");
const { doErr, setData } = require("../../untils/SetQueryData/index");

class UploadController extends Controller {
  async uploadFileSameName() {
    const { ctx } = this;
    let query = null;
    try {
      for (const file of ctx.request.files) {
        const target = path.join(
          this.config.baseDir,
          "app/public/upload/",
          file.filename
        );
        const r = fs.readFileSync(file.filepath);
        fs.writeFileSync(target, r);
      }
      query = setData("1");
      ctx.body = query;
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  async uploadFile() {
    const { ctx } = this;
    // console.log(ctx.ip);

    let query = null;
    console.log(ctx.request);
    try {
      const fileArr = [];
      for (const file of ctx.request.files) {
        const url = `public/upload/${dayjs().valueOf()}${Number.parseInt(
          Math.random() * 10000
        )}.${file.filename.split(".")[1]}`;
        const target = path.join(this.config.baseDir, `app/${url}`);
        fileArr.push(url);
        const r = await fs.readFileSync(file.filepath);
        fs.writeFileSync(target, r);
        fs.unlink(file.filepath);
      }
      query = setData(fileArr.toString());
      ctx.body = query;
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }

  async uploadFileChunk() {
    const fileUrl = "public/target";

    const { ctx } = this;
    try {
      const stream = await ctx.getFileStream();
      console.log(stream);

      const target = path.resolve(__dirname, "..", fileUrl, stream.fields.hash);
      console.log(target, "23213");

      // const UPLOAD_DIR = path.resolve(__dirname, "..", stream.fields.hash); // 大文件存储目录
      // console.log(UPLOAD_DIR);

      const result = await new Promise((resolve, reject) => {
        // 创建文件写入流
        const remoteFileStrem = fs.createWriteStream(target);
        stream.pipe(remoteFileStrem);
        remoteFileStrem.on("finish", () => {
          resolve(target);
        });
      });

      console.log(result);
      ctx.body = result;
      // fs.writeFileSync(target, file)
    } catch (error) {
      console.log(error);
    }

    // console.log(a);
  }

  async uploadFileStream() {
    const fileUrl = "public/files";
    const { ctx } = this;
    let query = null;
    try {
      const stream = await ctx.getFileStream();
      const _stream = stream.filename.split(".");
      const target = `${fileUrl}/${dayjs().valueOf()}${Number.parseInt(
        Math.random() * 10000
      )}.${_stream[_stream.length - 1]}`;
      const UPLOAD_DIR = path.resolve(__dirname, "..", target); // 大文件存储目录
      const result = await new Promise((resolve, reject) => {
        // 创建文件写入流
        const remoteFileStrem = fs.createWriteStream(UPLOAD_DIR);
        stream.pipe(remoteFileStrem);
        remoteFileStrem.on("finish", () => {
          resolve(target);
        });
      });
      query = setData(result);
      ctx.body = query;
    } catch (error) {
      ctx.logger.error(error);
      ctx.body = doErr(error);
    }
  }
}


module.exports = UploadController;
