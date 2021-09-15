const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.size = 0;
  }

  _transform(chunk, encoding, callback) {
    this.size += chunk.byteLength;
    let error = null;
    if(this.size > this.limit) {
      error = new LimitExceededError();
      chunk = null;
    }
    callback(error, chunk);
  }
}

module.exports = LimitSizeStream;
