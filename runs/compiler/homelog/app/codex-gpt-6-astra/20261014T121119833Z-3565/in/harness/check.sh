#!/bin/sh
# Type-check out/transform.ts (strict, no Node/Bun types), then run it on the samples.
set -e
cd "$(dirname "$0")/../.."
bun node_modules/typescript/lib/tsc.js -p in/harness/tsconfig.json
bun in/harness/run.ts "$@"
