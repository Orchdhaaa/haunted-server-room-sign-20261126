// Funniest Sign on a Haunted Server Room Door — make.fun program/v1 entry.
// Emits one funny sign line to /output/entry.txt, or to
// $MAKEFUN_OUTPUT_DIR/entry.txt when the harness sets that variable.
// Gate: UTF-8 text, 1 to 120 characters, a single line, no leading or
// trailing whitespace, no em/en dash, no control characters.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SIGN =
  "This server room is haunted by the last admin. He still closes tickets. He marks them all as user error.";

const LIMIT = 120;

function problems(text: string): string[] {
  const found: string[] = [];
  const length = [...text].length;
  if (length < 1 || length > LIMIT) {
    found.push(`length ${length} chars, must be 1-${LIMIT}`);
  }
  if (text !== text.trim()) {
    found.push("leading or trailing whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    found.push("must be a single line");
  }
  if (/^\s*$/.test(text)) {
    found.push("must not be only whitespace");
  }
  if (text.includes("\u2014") || text.includes("\u2013")) {
    found.push("must not contain an em dash or en dash");
  }
  for (const ch of text) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      found.push("must not contain control characters");
      break;
    }
  }
  return found;
}

function main(): void {
  const issues = problems(SIGN);
  if (issues.length > 0) {
    for (const issue of issues) {
      console.error(`entry rejected: ${issue}`);
    }
    process.exit(1);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, SIGN, "utf8");
  const written = readFileSync(outPath, "utf8");
  if (written !== SIGN) {
    console.error("entry rejected: output file does not match the sign line");
    process.exit(1);
  }
  console.log(`wrote ${[...SIGN].length} chars to ${outPath}`);
}

main();
