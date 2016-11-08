const fs = require('fs');
const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');

const proxyTarget = 'http://www.reddit.com';
const bundleFile = 'api.js';
const releaseFile = 'hello-api.tar.gz';
const templateBody = `<!DOCTYPE html>
<html>
  <head>
    <title>Hello API Dev Server</title>
  </head>
  <body>
    <h1>Hello API Dev Server</h1>
    <script src="/${bundleFile}"></script>
  </body>
</html>
`;

http.createServer((req, res) => {
  switch (req.url) {
    case `/${bundleFile}`:
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      return res.end(fs.readFileSync(path.resolve(__dirname, bundleFile)));
    case `/${releaseFile}`:
      res.writeHead(200, { 'Content-Type': 'application/gzip' });
      return res.end(fs.readFileSync(path.resolve(__dirname, releaseFile)));
    case '/':
    default:
      return res.end(templateBody);
  }
  httpProxy.createProxyServer({
    target: proxyTarget,
    changeOrigin: true
  }).web(req, res);
}).listen(3003);
