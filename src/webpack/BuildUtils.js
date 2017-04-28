const PACKAGE_NAMES = require('../../package.json').name;

function artifactName(baseName) {
  const nameParts = PACKAGE_NAMES.split('/');

  if (nameParts.length > 1 && PACKAGE_NAMES.charAt(0) == '@') {
    nameParts.splice(0, nameParts.length - 1)
  }

  if (baseName && baseName.charAt(0) !== '.') {
    nameParts.push(baseName);
  }
  const name = nameParts.join('-');

  if (baseName && baseName.charAt(0) === '.') {
    return name + baseName;
  }
  return name;
}

module.exports = {
  artifactName: artifactName
};