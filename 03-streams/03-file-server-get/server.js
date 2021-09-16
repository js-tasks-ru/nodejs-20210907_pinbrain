const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  function getFile(){
    if(pathname.length > 0 && pathname.indexOf('/') === -1){
      const filepath = path.join(__dirname, 'files', pathname);
      const stream = fs.createReadStream(filepath);
      stream.pipe(res);
      stream.on('error', (error) => {
        if(error.code = 404){
          res.statusCode = 404;
          res.end('File not found');
        }else{
          res.statusCode = 500;
          res.end('Something go wrong...');
        }
      });
      stream.on('aborted', () => {
        stream.destroy();
      });
    }else{
      res.statusCode = 400;
      res.end('Bad request url');
    }
  }

  switch (req.method) {
    case 'GET':
      getFile();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
