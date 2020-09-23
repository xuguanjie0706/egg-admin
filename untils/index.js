/**
 * @memberof utils
 * @description 随机密码生成
 * @function getPasswords
 * @param {Number}  pasLen  密码长度
 * @return {function}
 * @default 1000 毫秒
 * @example getPasswords(6)
 */
const getPasswords = (pasLen = 6) => {
  const pasArr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "_", "-", "$", "%", "&", "@", "+", "!"];
  let password = "";
  const pasArrLen = pasArr.length;
  for (let i = 0; i < pasLen; i++) {
    const x = Math.floor(Math.random() * pasArrLen);
    password += pasArr[x];
  }
  return password;
};


module.exports = {
  getPasswords,
};
