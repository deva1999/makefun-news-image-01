// SPDX-License-Identifier: MIT
// news-image-01 entry (Node 22, standard library only): its image is the
// entry.png beside this file, and the program writes it to /output/entry.png.
//
// The write is defensive, so a bad artifact fails loudly instead of being
// judged: the bundled bytes are checked against the competition gate before
// anything is written (PNG signature, IHDR dimensions at most 1024x1024, at
// most 1 MiB), the copy lands via a temporary file renamed into place (never
// a half-written entry.png), and the written file's SHA-256 must match the
// source's before the program exits cleanly.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from "node:crypto";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576; // 1 MiB gate
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

// Throws on anything the gate would reject; returns { width, height }.
function checkGate(buf) {
  if (buf.length > MAX_BYTES) {
    throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB gate`);
  }
  if (buf.length < 24 || !buf.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("entry.png does not start with the PNG signature");
  }
  if (buf.toString("ascii", 12, 16) !== "IHDR") {
    throw new Error("entry.png has no IHDR chunk where one belongs");
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  if (width === 0 || height === 0 || width > MAX_WIDTH || height > MAX_HEIGHT) {
    throw new Error(`entry.png is ${width}x${height}, outside the 1024x1024 gate`);
  }
  return { width, height };
}

const srcPath = fileURLToPath(new URL("./entry.png", import.meta.url));
const bytes = readFileSync(srcPath);
checkGate(bytes);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.png");
const tmpPath = join(outDir, `.entry.png.tmp-${process.pid}`);
writeFileSync(tmpPath, bytes);
renameSync(tmpPath, outPath); // atomic on the same filesystem

const written = readFileSync(outPath);
if (sha256(written) !== sha256(bytes)) {
  throw new Error("written entry.png does not match the bundled image (sha256)");
}
