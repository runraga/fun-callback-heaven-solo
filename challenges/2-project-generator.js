const fs = require('fs');
const simpleGit = require('simple-git');

function projectGenerator(projectName, cb) {
  fs.mkdir(`./${projectName}`, (err, projectCreated) => {
    if (err) {
      cb(Err);
    } else {
      fs.writeFile(`${projectName}/index.js`, '', err => {
        if (err) cb(err);
      });
      fs.writeFile(`${projectName}/.gitignore`, 'node_modules', err => {
        if (err) cb(err);
      });
      fs.mkdir(`./${projectName}/spec`, (err, specFolderAdded) => {
        if (err) {
          cb(err);
        } else {
          fs.writeFile(`./${projectName}/spec/index.test.js`, 'test content', err => {
            if (err) {
              cb(err);
            }
          });
        }
      });
      fs.writeFile(`./${projectName}/README.md`, `# ${projectName}`, err => {
        if (err) {
          cb(err);
        }
      });

      fs.writeFile(`./${projectName}/.eslintrc.json`, ``, err => {
        if (err) {
          cb(err);
        }
      });
      fs.writeFile(`./${projectName}/package.json`, `{"devDependencies": {},"scripts": {
        "test": "jest"}}`, err => {
        if (err) {
          cb(err);
        } else {
        
        }
      });
      const git = simpleGit(`./${projectName}`);
      git.init((err, result) => {
      });
    }
  });
}

module.exports = projectGenerator;
