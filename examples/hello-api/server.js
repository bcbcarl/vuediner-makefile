// imports
const fs = require('fs');
const http = require('http');
const httpProxy = require('http-proxy');
const path = require('path');

// config
const title = 'Hello API Dev Server';
const proxyTarget = 'http://www.reddit.com';

// files
const bundleFile = 'api.js';
const releaseFile = 'hello-api.tar.gz';

// components
const FilePicker = `<input type="file" name="uploadFiles" id="uploadFiles">
  <script>
    let fileInput = document.body.querySelector('#uploadFiles');
    fileInput.addEventListener("change", (e) => console.log(e.target.files[0]));
  </script>`;

// templates
const templateBody = `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
  </head>
  <body>
    <h1>${title}</h1>
    <script src="/${bundleFile}"></script>
    <h2>File upload validation</h2>
    ${FilePicker}
  </body>
</html>`;

// dev server
http.createServer((req, res) => {
  switch (req.url) {
    case `/`:
      return res.end(templateBody);
    case `/${bundleFile}`:
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      return res.end(fs.readFileSync(path.resolve(__dirname, bundleFile)));
    case `/${releaseFile}`:
      res.writeHead(200, { 'Content-Type': 'application/gzip' });
      return res.end(fs.readFileSync(path.resolve(__dirname, releaseFile)));
    default:
      break;
  }
  httpProxy.createProxyServer({
    target: proxyTarget,
    changeOrigin: true
  }).web(req, res);
}).listen(3003);
