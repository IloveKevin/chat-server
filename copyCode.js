const fs = require('fs');
const path = require('path');

const sourceDir = './src/common/code';
const targetDir = '../chat-web/src/common/code';

fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
        const sourceFile = path.join(sourceDir, file);
        const targetFile = path.join(targetDir, file);

        fs.copyFile(sourceFile, targetFile, err => {
            if (err) throw err;
            console.log(`${file} was copied to ${targetFile}`);
        });
    });
});
