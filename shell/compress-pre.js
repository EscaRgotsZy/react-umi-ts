const compressing = require('compressing');
const path = require('path');
const fs = require('fs');

function resolve() {
  return path.resolve(process.cwd(), ...arguments);
}

const source = resolve('dist');
const target = resolve('output');

mkdirPath(target);

const output = (() => {
  return resolve('output/h5.zip');
})();

compressing.zip
  .compressDir(source, output)
  .then(() => {
    console.log('compress dist success');
  })
  .catch((err) => {
    console.error(err);
  });

/**
 * 判读路径是否存在,如不存在创建文件夹
 */
function mkdirPath(pathStr) {
  if (fs.existsSync(pathStr)) {
    var tempstats = fs.statSync(pathStr);
    if (!tempstats.isDirectory()) {
      fs.unlinkSync(pathStr);
      fs.mkdirSync(pathStr);
    }
  } else {
    fs.mkdirSync(pathStr);
  }
  return pathStr;
}
