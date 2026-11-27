// Hearth & Ledger — the hand-in program (Node 22, standard library only).
// The site is this directory's app/ folder: plain static files a browser
// opens at app/index.html (ES modules, CSS, no build step), its content
// held in its own files — nothing it runs, styles or shows loads over
// the network. This program copies app/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json, the summary the
// judge reads (the screenshots, the first load's files and bytes, and
// the source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json
// to be byte for byte what its own copy writes.
//
// Serve the site locally with `node serve.ts`, then open
// http://localhost:8080. Outside the grader's container,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more
// than 4 screenshots or one over 256 KiB; more than 993 files and
// directories in app/ or 16 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

// Read the dossier back and fail loudly rather than hand in a broken
// one: it must parse, name the site's own files, and match the copies
// just written byte for byte.
const dossier = JSON.parse(readFileSync(join(out, 'dossier.json'), 'utf8'));
if (!dossier || typeof dossier !== 'object') throw new Error('dossier.json did not parse');

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* walk(path);
    else yield path;
  }
}
for (const rel of ['app', 'screenshots']) {
  const srcDir = join(here, rel);
  if (!existsSync(srcDir)) continue;
  for (const src of walk(srcDir)) {
    const dst = join(out, rel, src.slice(srcDir.length + 1));
    if (!existsSync(dst) || !readFileSync(src).equals(readFileSync(dst))) {
      throw new Error(`copy mismatch: ${rel} file did not reach /output intact`);
    }
  }
}
console.log(`hand-in ready: dossier.json (${readFileSync(join(out, 'dossier.json')).length} bytes)`);

