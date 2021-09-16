const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  function deleteFile() {
    if(pathname.length > 0 && pathname.indexOf('/') === -1){
      const filepath = path.join(__dirname, 'files', pathname);
      fs.stat(filepath, (err, stats) => {
        if(err || !stats.isFile()) {
          res.statusCode = 404;
          res.end('file not found');
        }else{
          fs.unlink(filepath, (err) => {
              if(err){
                  res.statusCode = 500;
                  res.end('Server error')                        
              }else{
                  res.statusCode = 200;
                  res.end('File was deleted')
              }
          });
        }
      });
    }else{
      res.statusCode = 400;
      res.end('Bad request url');
    }
  }

  switch (req.method) {
    case 'DELETE':
      deleteFile();
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
