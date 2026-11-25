'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'well-crlf-'));
try {
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root }).toString().split('\0').filter(Boolean);
  for (const file of files) {
    const dest = path.join(dir, file);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const bytes = fs.readFileSync(path.join(root, file));
    if (/\.(?:html|js|cjs|json|css|md|yml|yaml|py|txt|csv|svg)$/i.test(file)) {
      fs.writeFileSync(dest, bytes.toString('utf8').replace(/\r?\n/g, '\r\n'));
    } else fs.writeFileSync(dest, bytes);
  }
  const tests = files.filter(file => /^[^/]+\.test\.cjs$/.test(file));
  if (!tests.length) throw Error('No regression tests found');
  execFileSync(process.execPath, ['--test', ...tests], { cwd: dir, stdio: 'inherit' });
  console.log('CRLF fixture suite passed; original checkout unchanged.');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
