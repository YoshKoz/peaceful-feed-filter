# Peaceful Feed

A Manifest V3 browser extension that dims grief and tragedy posts in your social feeds, so you can scroll without ambushes. Hover a dimmed post to read it anyway — nothing is hidden or blocked, just softened.

## Why

Social feeds surface death announcements, funerals, and "gone too soon" posts with the same weight as everything else. Peaceful Feed doesn't filter content out of your life — it just turns the emotional volume down until you choose to turn it back up.

## How it works

A content script runs at `document_start` on each supported site, walks the DOM (including shadow roots) for post-level elements, and tests their text against a bilingual (English + Dutch) regex of grief-related terms — "passed away", "funeral", "in memoriam", *overleden*, *rouw*, *condoleance*, etc. Matching posts get `opacity: 0.35`, restored to full opacity on mouse hover. A `MutationObserver` keeps re-scanning as feeds infinite-scroll.

## Supported sites

LinkedIn, X/Twitter, Facebook, Instagram, Reddit (new and old), YouTube, TikTok — each with a site-specific CSS selector for its post structure, falling back to a generic selector elsewhere.

## Features

- Built-in EN/NL keyword pattern, matched case-insensitively as whole words
- Options page to add your own extra keywords/phrases (one per line), stored via `browser.storage.local`
- Live updates — new keywords apply immediately via `storage.onChanged`, no reload needed
- No network calls, no telemetry, no permissions beyond `storage`

## Install (unpacked, development)

**Chrome / Edge / Brave**
1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this folder

**Firefox**
1. Go to `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → select `manifest.json`

## Configuration

Click the extension's options page and add extra phrases, one per line — these are merged with the built-in defaults, not a replacement for them.

## Files

```
manifest.json    — MV3 manifest, content script + host permissions
content.js       — DOM walker, regex matcher, dim/undim logic, MutationObserver
options.html/js  — extra-keyword editor backed by storage.local
icons/icon.svg   — extension icon
```
