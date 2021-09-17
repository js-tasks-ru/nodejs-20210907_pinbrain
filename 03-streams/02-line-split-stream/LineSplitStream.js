const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.str = '';
    this.eolLength = os.EOL.length;
  }

  _transform(chunk, encoding, callback) {
    this.str += chunk;
    let index = -1;
    while ((index = this.str.indexOf(os.EOL)) !== -1) {
      if(index > 0) this.push(this.str.slice(0, index));
      this.str = this.str.slice(index + this.eolLength);
    }
    callback(null);
  }

  _flush(callback) {
    if(this.str.length > 0) {
      this.push(this.str);
    }
    callback(null);
  }
}

module.exports = LineSplitStream;
