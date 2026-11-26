const { readText } = require('./test-text.cjs');
const path = require('node:path');
const { archiveRows, showcaseTitles } = require('../catalog.js');
const { reviews, slug } = require('../registry.js');

function currentTitles() {
  const html = readText(path.join(__dirname, '..', 'index.html'));
  // The featured card headings are authored in HTML for readers without JavaScript.
  const featured = [...html.matchAll(/<article class="card"[^>]*\sdata-featured(?:\s|>)[\s\S]*?<h3>([^<]+)<\/h3>/g)]
    .map(match => match[1]);
  return [...featured, ...Object.values(showcaseTitles), ...archiveRows.map(row => row.title)];
}

function expandedRecords() {
  return Array.from(reviews, ([id, detail]) => ({ id, ...detail }));
}

module.exports = { currentTitles, expandedRecords, slug };
