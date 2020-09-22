/**
 * 配图信息 必用
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// Schema 结构
var FileSchema = Schema({
    name: String,
    file:String,
    order:String,
    remarks:String,
    sort:{
        type:Number,
        default:0
    }, 
    up: {
      type: Number,
      default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('File', FileSchema);