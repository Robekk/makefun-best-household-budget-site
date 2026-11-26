// Hearth & Ledger — the hand-in program (Node 22, standard library only).
//
// The site itself is the app/ folder beside this file: plain static files
// (index.html, style.css, data.js, views.js, main.js) that a browser runs
// with no build step and no network. This program's whole job is to hand
// it in the way the bounty asks: copy app/ and screenshots/ into the
// output directory, then write dossier.json with the vendored make.fun
// library, byte for byte the way the scorer writes it — the vendored
// file is copied from the kit unchanged for exactly that reason.
//
// Run it locally the same way the grader does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });

const shotsDir = join(out, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), shotsDir, { recursive: true });
}

// The caps are the scorer's own (from the kit's gate reference): the
// dossier text is capped at 160 KiB, at most 4 screenshots of at most
// 256 KiB each, and the app may hold at most 993 files / 16 MiB.
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`Hearth & Ledger handed in: app/ and screenshots/ copied to ${out}, dossier.json written.`);
