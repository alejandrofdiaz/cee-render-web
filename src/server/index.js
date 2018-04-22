const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const ceeRender = require('cee-render');
const server = express();
const cors = require('cors');

const binRelPath = process.env.TEMP_PATH || 'tmp';

const binPath = path.resolve(process.cwd(), binRelPath);

createFolders(binPath);
try {
  server.use(cors());

  server.post('', (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields = {}, { file }) => {
      let number = file.name;
      if (!!fields.name) number = fields.name;
      try {
        ceeRender.getPDFFromXml(file.path, binPath, number).then(
          path => {
            res.status(200);
            res.download(path, `${file.name}.pdf`);
          },
          err => {
            console.log(err);
            res.status(500);
            res.json({ err });
          }
        );
      } catch (err) {
        console.log(err);
        res.status(500);
        res.json({ err });
      }
    });
  });
} catch (err) {
  console.log(err);
}

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
        console.log('now ' + _currentPath + ' exists');
        return true;
      } catch (err) {
        console.log('Something went wrong :/');
        return false;
      }
    }
  });
}

module.exports = server;
