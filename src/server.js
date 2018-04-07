const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const ceeRender = require('cee-render');
const server = express();
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');

const rootPath = __dirname;
const binRelPath = process.env.TEMP_PATH || 'tmp';

const binPath = path.resolve(process.cwd(), binRelPath);

if (!!process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  console.log('production!!');
  server.use(compression());
  server.use(helmet());
}

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
          console.log(err);
          res.status(500);
          res.json();
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500);
      res.json();
    }
  });
});

server.listen(3000, () => {
  console.log('Saving files in ' + binPath);
  console.log('yaaay');
});

function createFolders(...paths) {
  return paths.map(currentPath => {
    let _currentPath = currentPath;
    if (!path.isAbsolute(currentPath)) {
      _currentPath = path.resolve(process.cwd(), currentPath);
    }
    if (fs.existsSync(_currentPath)) {
      console.log(_currentPath + ' exists');
      return true;
    } else {
      try {
        fs.mkdirSync(_currentPath);
        console.log('now' + s_currentPath + ' exists');
        return true;
      } catch (err) {
        console.log('Something went wrong :/');
        return false;
      }
    }
  });
}
