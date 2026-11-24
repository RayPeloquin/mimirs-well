"use strict";
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const files = fs.readdirSync(root).filter(n => n.endsWith(".html"));
const issues = [];
let checked = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
    const raw = match[1].replace(/&amp;/g, "&");
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(raw)) continue;
    const target = raw.split(/[?#]/)[0];
    if (!target) continue;
    let decoded;
    try { decoded = decodeURIComponent(target); } catch { issues.push(file + ": invalid URL " + raw); continue; }
    const resolved = path.resolve(root, decoded);
    if (!resolved.startsWith(root + path.sep)) continue;
    checked++;
    if (!fs.existsSync(resolved)) issues.push(file + ": missing " + raw);
  }
}
console.log("Checked " + checked + " local href/src references in " + files.length + " top-level HTML pages.");
for (const issue of [...new Set(issues)]) console.error(issue);
if (issues.length) process.exitCode = 1;
console.log("External HTTP responses, fragment IDs and dynamically generated links are outside this check.");
