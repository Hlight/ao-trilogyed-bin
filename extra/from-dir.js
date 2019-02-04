// from-dir.js
// src: https://stackoverflow.com/a/25462405
/* Usage:
fromDir('dir/path/', /^.*$/, function (filename) {
  log('-- found: ', filename);
});
*/

const fs = require('fs');
const path = require('path');
const logger = require('logat');

module.exports = function fromDir(startPath, filter, callback) {

  logger.info('Starting from dir '+startPath+'/');

  if (!fs.existsSync(startPath)) {
    logger.error("no dir: " + startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    logger.info(files[i])
    // console.log('path.join('+startPath+', '+files[i]+');')
    // var filename = startPath + files[i];//
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    // if (stat.isDirectory()) {
    //   fromDir(filename, filter, callback); //recurse
    // } else if
    if (stat.isDirectory()) {
      if (filter.test(filename)) callback(filename);
    }
  }
}