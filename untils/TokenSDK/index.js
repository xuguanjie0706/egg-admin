const jwt = require('jsonwebtoken')
const Token = require("../../database/schema/token")


// jwt.verify(a, secret, (error, decoded) => {
//     if (error) {
//         console.log(error.message, 2)
//         return
//     }
//     console.log(decoded, 1)
// })

function getToken(payload, secret = "ILOVELI", day = "30day") {
  const token = jwt.sign(payload, secret, {
    expiresIn: day
  })

  return Token.findOneAndUpdate({
    _user: payload._id
  }, {
    token
  }, {
    new: true,
    upsert: true
  }).exec()
}

async function checkToken(a, secret = "ILOVELI") {
  let data = jwt.verify(a, secret, (error, decoded) => {
    return error ? null : decoded
  })
  const isHave = await Token.countDocuments({
    token: a
  }).exec()

  return data && data._id ? isHave === 1 ? data : null : null
}

function getAllToken(payload, secret = "ILOVELI", day = "30day") {
  const token = jwt.sign(payload, secret, {
    expiresIn: day
  })
  return token
}

function checkAllToken(a, secret = "ILOVELI") {
  let data = jwt.verify(a, secret, (error, decoded) => {
    return error ? null : decoded
  })
  return data
}




module.exports = {
  getToken,
  checkToken,
  getAllToken,
  checkAllToken
}