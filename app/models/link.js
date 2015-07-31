var db = require('../config');
var crypto = require('crypto');

var mongoose = require('mongoose');

var urlSchema = new mongoose.Schema({
      url: String,
      base_url: String,
      code: String,
      title: String,
      visits: Number
});

var Link = mongoose.model('Link', urlSchema);

urlSchema.pre('save', function(){
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
});

module.exports = Link;
