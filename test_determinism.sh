#!/bin/sh
# Hearth & Ledger — determinism check: run main.ts twice into two
# fresh output directories and require every byte to match.
set -eu
cd "$(dirname "$0")"

rm -rf /tmp/hl-out-a /tmp/hl-out-b
mkdir -p /tmp/hl-out-a /tmp/hl-out-b
MAKEFUN_OUTPUT_DIR=/tmp/hl-out-a node main.ts
MAKEFUN_OUTPUT_DIR=/tmp/hl-out-b node main.ts

if diff -r /tmp/hl-out-a /tmp/hl-out-b > /tmp/hl-diff.txt 2>&1; then
  echo "DETERMINISM PASS: both runs wrote identical bytes"
  echo "dossier.json: $(wc -c < /tmp/hl-out-a/dossier.json) bytes"
  echo "files: $(find /tmp/hl-out-a -type f | wc -l)"
else
  echo "DETERMINISM FAIL: the two runs differ"
  cat /tmp/hl-diff.txt
  exit 1
fi
