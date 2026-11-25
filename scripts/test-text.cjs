'use strict';
const fs = require('node:fs');
// Normalize only text line endings; preserve all other bytes/characters in assertions.
function readText(file) {
  return fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
}
module.exports = { readText };
