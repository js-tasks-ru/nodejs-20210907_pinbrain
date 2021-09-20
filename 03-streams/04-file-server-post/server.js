const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  function writeFile(){

    if(pathname.includes('/') || pathname.includes('..')) {
      res.statusCode = 400;
      res.end('Nested paths are not allowed');
      return;
    }

    const filepath = path.join(__dirname, 'files', pathname);
    const limitSizeStream = new LimitSizeStream({limit: 1000000});
    const outStream = fs.createWriteStream(filepath, {
        flags: 'wx'
    });

    req.pipe(limitSizeStream)
      .pipe(outStream);

    outStream.on('finish', () => {
      res.statusCode = 201;
      res.end('Data was saved');
    });

    outStream.on('error', (err) => {
      if(err.code === 'EEXIST') {
        res.statusCode = 409;
        res.end('File already exists'); 
        return;
      }
      res.statusCode = 500;
      res.end('Server error');
    });

    limitSizeStream.on('error', (err) => {  
      if (err.code === 'LIMIT_EXCEEDED') {
        res.statusCode = 413;
        res.end('File is too big!');
      }else{
        res.statusCode = 500;
        res.end('Server error');
      }
      
      outStream.destroy();
      fs.unlink(filepath, (err) => {});        
    });

    req.on('data', (chunk) => {});

    req.on('aborted', () => {
      limitSizeStream.destroy();
      outStream.destroy();
      fs.unlink(filepath, (err) => {});       
    });
  }

  switch (req.method) {
    case 'POST':
      writeFile();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
