const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const ceeRender = require('cee-render');
const server = express();
const cors = require('cors');

const rootPath = __dirname;
const binPath = path.resolve(process.cwd(), 'bin');

createFolders(binPath);

server.use(cors());

server.use('/', express.static(__dirname + '/public'));

server.post('', (req, res, err) => {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields = {}, { file }) => {
    let number = file.name;
    if (!fields.name) number = fields.name;
    try {
      ceeRender.getPDFFromXml(file.path, binPath, number).then(
        path => {
          res.status(200);
          res.download(path, `${file.name}.pdf`);
        },
        err => {
          res.status(500);
          res.json();
        }
      );
    } catch (err) {
      res.status(500);
      res.json();
    }
  });
});

server.listen(3000, () => {
  console.log('yaaay');
});

function createFolders(...paths) {
  return paths.map(currentPath => {
    let _currentPath = currentPath;
    if (!path.isAbsolute(currentPath)) {
      _currentPath = path.resolve(process.cwd(), currentPath);
    }
    if (fs.existsSync(_currentPath)) {
      return true;
    } else {
      try {
        fs.mkdirSync(_currentPath);
        return true;
      } catch (err) {
        return false;
      }
    }
  });
}
