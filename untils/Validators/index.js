
/** 大于0  **/
const numValidator = val => {
  if (val >= 0) {
    return true;
  }
  return false;
};

/** 手机验证  **/

const phoneValidator = val => {
  if ((/^1[3|4|5|8][0-9]\d{4,8}$/.test(val))) {
    return true;
  }
  return false;
}


module.exports = {
  numValidator,
  phoneValidator
}