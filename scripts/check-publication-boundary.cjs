#!/usr/bin/env node
"use strict";

/*
 * Mimir's Well publication preflight: intentionally limited tripwire.
 * This cannot detect all sensitive material and cannot supply a human release decision.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const root = path.resolve(__dirname, "..");
const publication = require("../publication-controls.js");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8"));
const html = fs.readFileSync(path.join(root, "catalog.html"), "utf8");
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
const registry = fs.readFileSync(path.join(root, "registry.js"), "utf8");
const equationSrc = fs.readFileSync(path.join(root, "equation-cores.js"), "utf8");
const equationUiSrc = fs.readFileSync(path.join(root, "equation-bench.js"), "utf8");
const combineUiSrc = fs.readFileSync(path.join(root, "combine.js"), "utf8");

const holds = Object.keys(publication.holds);
const watches = Object.keys(publication.watches);
const identified = [...holds, ...watches];
const ids = new Set(catalog.map(entry => entry.id));

assert.equal(holds.length, 6, "Unexpected number of source-release holds");
assert.equal(watches.length, 3, "Unexpected number of publication-review watch entries");
assert.equal(new Set(identified).size, identified.length, "Duplicate publication status record");
assert.ok(identified.every(id => ids.has(id)), "Publication controls contain an unknown catalog record");
assert.ok(fs.existsSync(path.join(root, "publication-safety.html")), "Publication policy page is missing");
assert.ok(fs.existsSync(path.join(root, "docs/technical-source-publication-policy.md")), "Detailed policy is missing");
assert.ok(home.includes('src="publication-controls.js') &&
  home.indexOf('src="publication-controls.js') < home.indexOf('src="registry.js'),
  "Publication control metadata must load before the project registry");
assert.ok(registry.includes("publication.holdLabel") && registry.includes("publication.policy"),
  "Registry publication status indicators are missing");

/* Ensure two curated lists agree. A new equation cannot appear in the public
 * Equation Bench solely through equation-cores.js; it also needs a reviewed
 * eligibility entry. This is a change-detection test, not semantic safety AI. */
const approved = publication.equationEligible;
assert.ok(Array.isArray(approved) && approved.length > 0, "Equation release allowlist is required");
assert.equal(new Set(approved).size, approved.length, "Duplicate equation eligibility IDs");
assert.ok(approved.every(id => ids.has(id)), "Equation eligibility references missing catalog entries");
assert.ok(approved.every(id => !Object.hasOwn(publication.holds, id)),
  "Held HIPPO project must not be equation-eligible");
const sandbox = {window: {}};
vm.runInNewContext(equationSrc, sandbox, {timeout: 1000, filename: "equation-cores.js"});
const sourceIds = Object.keys(sandbox.window.WellEquationCores || {});
assert.deepEqual(sourceIds.slice().sort(), approved.slice().sort(),
  "Curated equation cores and reviewed publication allowlist drifted");
assert.ok(equationUiSrc.includes("approved.has(id)") &&
  equationUiSrc.includes("Object.hasOwn(releaseHolds, id)"),
  "Equation Bench must check approved source AND release hold");
assert.ok(combineUiSrc.includes("!isReleaseHeld(entry.id)") &&
  combineUiSrc.includes("roles.some(role => isReleaseHeld(pair[role]))"),
  "The public combination Bench must exclude held sources from selection/export");

for (const id of identified) {
  const match = html.match(new RegExp('<li id="' + id + '">([\\s\\S]*?)<\\/li>'));
  assert.ok(match, "Missing static catalog record for " + id);
  const label = publication.holds[id] ? publication.holdLabel : publication.watchLabel;
  assert.ok(match[1].includes(label) && match[1].includes("publication-safety.html"),
    "Missing status or policy link for " + id);
}

/*
 * Private source files must never be checked into this public repo, even if hidden
 * from its web navigation. These path checks catch known classes of mistakes.
 * They are NOT a contents-based security scanner or a safety certification.
 */
const disallowedDirectories = new Set([
  "private", "unpublished", "restricted", "source-originals", "sensitive-originals"
]);
const riskySourceName =
  /(?:hippo|thunderlung|thunderhide|mimir[-_ ]?hippo).*(?:original|private|build[-_ ]?pack|control[-_ ]?design|wiring|schematic|construction|assembly|firmware|tuning|full[-_ ]?source|bill[-_ ]?of[-_ ]?materials)/i;
const sourceExtensions = /\.(?:txt|md|pdf|zip|docx?|csv|json|js|py|ino|step|stl)$/i;
const prohibited = [];
function walk(dir, relative = "") {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (relative === "" && [".git", "node_modules"].includes(entry.name)) continue;
    const next = relative ? relative + "/" + entry.name : entry.name;
    if (entry.isDirectory()) {
      if (disallowedDirectories.has(entry.name.toLowerCase())) {
        prohibited.push(next + "/ (restricted folder inside public repository)");
        continue;
      }
      walk(path.join(dir, entry.name), next);
    } else if (entry.isFile() && sourceExtensions.test(entry.name) && riskySourceName.test(entry.name)) {
      prohibited.push(next + " (source-package filename needs a private publication review)");
    }
  }
}
walk(root);
if (prohibited.length) {
  console.error("Publication preflight FAILED. Review these paths outside this public repository:");
  for (const p of prohibited) console.error(" - " + p);
  process.exitCode = 1;
} else {
  console.log("Publication preflight passed: 6 release holds and 3 review watches labeled, curated equation allowlist agrees, and no flagged private-source paths found.");
  console.log("This is a filename/path tripwire only. Independent review and branch protection are separate requirements.");
}
