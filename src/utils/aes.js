import config from '../utils/config.js';
module.exports = {
  encode (data) {
    let crypto = require('crypto');
    var cipher = crypto.createCipheriv(config.ALGORITHM, config.KEY,config.IV);
    var crypted = cipher.update(data, config.CLEARENCODING, 'binary');
    crypted += cipher.final('binary');
    crypted = new Buffer(crypted, 'binary').toString(config.CIPHERENCODING);
    return crypted;
  }
};
