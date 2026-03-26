const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadScript(...filePaths) {
  filePaths.forEach(fp => {
    const fullPath = path.resolve(__dirname, '../..', fp);
    const code = fs.readFileSync(fullPath, 'utf-8');
    const modified = code.replace(/^(const|let) /gm, 'var ');
    vm.runInThisContext(modified);
  });
}

module.exports = { loadScript };
