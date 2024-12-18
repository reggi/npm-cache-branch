const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4873;
const BASE_DIR = path.join(__dirname, 'module_cache/storage');

const server = http.createServer((req, res) => {
  const filePath = path.join(BASE_DIR, req.url === '/' ? '' : req.url);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }

    if (stats.isDirectory()) {
      const packageJsonPath = path.join(filePath, 'package.json');
      fs.readFile(packageJsonPath, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        const packageJson = JSON.parse(data);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify(packageJson, null, 2));

        fs.readdir(filePath, (err, files) => {
          if (err) {
            res.end();
            return;
          }

          files.forEach(file => {
            if (file !== 'package.json') {
              res.write(`\n- ${file}`);
            }
          });

          res.end();
        });
      });
    } else {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});