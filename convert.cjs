const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('frontend/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const isTs = filePath.endsWith('.ts');
    const newExt = isTs ? '.js' : '.jsx';
    const newFile = filePath.replace(/\.tsx?$/, newExt);
    console.log(`Detyping ${filePath} to ${newFile}...`);
    execSync(`npx -y detype "${filePath}" "${newFile}"`, { stdio: 'inherit' });
    fs.unlinkSync(filePath);
  }
});
