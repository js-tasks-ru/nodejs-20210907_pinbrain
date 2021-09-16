const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');
const { chunk } = require('lodash');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  function writeFile(){
    if(pathname.length > 0 && pathname.indexOf('/') === -1){
      const filepath = path.join(__dirname, 'files', pathname);
      fs.stat(filepath, (err, stats) => {
        if(err || !stats.isFile()) {
          const limitSizeStream = new LimitSizeStream({limit: 1000000});
          const outStream = fs.createWriteStream(filepath);
          req.pipe(limitSizeStream)
            .pipe(outStream);
  
          outStream.on('finish', () => {
            res.statusCode = 201;
            res.end('Data was saved');
          });

          outStream.on('error', () => {
            outStream.on('close', () => {
              fs.unlink(filepath, (err) => {
                if (err) console.error(err);
                console.log('file ' + filepath + ' was deleted....');
              });        
            })
          })
  
          limitSizeStream.on('error', (err) => {  
            if (err.code === 'LIMIT_EXCEEDED') {
              res.statusCode = 413;
              res.end('File is too big!');
            }else{
              res.statusCode = 500;
              res.end('Server error');
            }
            outStream.destroy(err);
          });

          req.on('data', (chunk) => {});

          req.on('aborted', () => {
            outStream.destroy(new Error());
          });

        }else{
          res.statusCode = 409;
          res.end('File already exists')
        }
      });      
    }else{
      res.statusCode = 400;
      res.end('Bad request url');
    }
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
