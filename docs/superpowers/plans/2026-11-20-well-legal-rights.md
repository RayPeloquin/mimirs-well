# Mimir’s Well Legal & Rights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a Legal & Rights page that reserves legally protectable original materials and specifies the official permissions email.

**Architecture:** Add a static, self-contained `legal.html` page using the Well’s existing dark, mint and gold visual style. Add one direct link to the existing homepage footer. Avoid new scripts, services, or personal-data collection.

**Tech Stack:** Plain HTML/CSS, GitHub Pages, accessible anchors; existing GitHub repository.

**Spec:** `docs/superpowers/specs/2026-11-20-well-legal-rights-design.md`

## Global Constraints

- Public contact: `raypeloquin54@gmail.com` (explicitly approved for publication).
- Moltbook is informal only; a message to Asteris does not grant permission.
- Respect fair use, statutory exceptions, platform rights, and explicit project licenses.
- Avoid any patent, copyright, medical-validation, or AI inventorship overclaim.
- Keep all unrelated Well pages and project content unchanged.

## Review Focus

- Footer navigation opens the legal page from the live deployed root and works by keyboard.
- The page is readable at narrow mobile widths without horizontal scrolling.
- Permission contact is the exact approved address and uses a functioning `mailto:` link.
- The page says no blanket license but retains legal exceptions and project-specific licenses.
- Asteris and other AI contributions are credited without implying automatic legal inventorship.

---

### Task 1: Publish the legal page

**Files:**
- Create: `legal.html`

**Interfaces:**
- Produces: public route `/mimirs-well/legal.html` consumed by Task 2.

- [ ] **Step 1: Check existing route (RED).** Visit `https://raypeloquin.github.io/mimirs-well/legal.html`; expect not to find a Legal & Rights page.
- [ ] **Step 2: Create `legal.html`.** Semantic headings, readable responsive CSS, sections from the approved spec, `mailto:raypeloquin54@gmail.com`, and a home link.
- [ ] **Step 3: Verify (GREEN).** Read back content via GitHub and check page route after Pages deploy; expect title, sections and contact to render.
- [ ] **Step 4: Commit.** `feat: publish Legal & Rights page`.

### Task 2: Link the legal page from the Well

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `legal.html` from Task 1.

- [ ] **Step 1: Check current footer (RED).** Home footer has no accessible Legal & Rights link.
- [ ] **Step 2: Add one footer link.** Use relative `href="legal.html"`; preserve existing footer copy and layout.
- [ ] **Step 3: Verify (GREEN).** Read back committed HTML and activate the live footer link to reach the legal page.
- [ ] **Step 4: Commit.** `feat: link legal notice from Well footer`.

### Final verification

- [ ] Confirm legal content does not assert rights over unprotected ideas, third-party material, or unfiled patents.
- [ ] Check desktop and narrow/mobile presentation.
- [ ] Check live Pages status and document any delay or partial deployment honestly.
