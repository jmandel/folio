# Stage 2 receipt: wire, sync, trust

Branch `stage2` (worktree `.worktrees/stage2`). Nothing pushed.

## What exists

| Path | What |
|---|---|
| `spec/signing.md` | SD-JWT (RFC 9901) profile: disclosure units, did:web keys, exact claims and disclosure layout, what is hashed/signed, verification steps, partial-item display rules, context-loss (sertraline) section with presenter duties |
| `spec/sync.md` | Sync node API: per-patient append-only feed with opaque cursor and paging, schemas by URL and by SHA-256, did.json, reader duties |
| `packages/core` | `parseMarkdown`/`toMarkdown`/`parseJson`/`toJson`; `extractRefs` (code-point offsets + tag offsets); `validateItem`; `defaultView` (supersede/retract, late originals, conflicts, issuer-scoped ids); `sign`/`present`/`presentWithholding`/`listUnits`/`verify`/`renderVerified`; `createDidWebResolver` with pluggable fetch, host map, or preloaded docs. Browser-safe (WebCrypto, no fs); fs helpers in `@folio/core/node` |
| `packages/core/scripts/gen-dev-keys.ts` | Generates `sources/<src>/keys/issuer-key.json` (DEMO-ONLY, says so inside) and `did.json` |
| `packages/sync` | `SyncNode`/`startNode` (Bun.serve), `pullPages` client, CLI launching all four sources (`--items 'dir/{source}'`, `--base-port`, `--sources`) |
| `packages/personal-agent` | `sync`, `timeline [--history]`, `units`, `present` (`--withhold`, `--disclose`, `--withhold-matching`), `verify [--offline]`; config `hero.config.json` |
| `work/stage2-spec-issues.md` | Issues found and the three record-item.md edits |

## How to run

```
bun install
bun test                         # 225 tests
bun run typecheck                # tsc, clean
bun run nodes                    # four nodes: riverside 8101, northgate 8102, lakeview 8103, homelog 8104
bun run agent sync               # store in .folio-agent/hero (git-ignored)
bun run agent timeline
bun run agent units --item 01KXEQ
bun run agent present --item 01KXEQ --withhold-matching sertraline --out /tmp/p.txt
bun run agent verify /tmp/p.txt
```

## Test results

225 pass, 0 fail (`bun test`, about 0.4 s). `bun work/check-examples.ts`: 31 payloads, 0 problems.

- Round-trip, all 31 examples: md → item → md byte-exact; md → JSON → item equal (key order
  included); canonical md parses back equal; canonical frontmatter equals the examples'; ref offsets
  checked.
- Sign → full presentation → verify gives back the identical item for all 31.
- Tamper (on a sertraline-withheld presentation): one char in a disclosed span, in prose outside
  spans, in the envelope, in a payload value (string and number) all fail. Also a forged disclosure
  for the withheld slot, a disclosure from another item, an issuer relabel, and a KB-JWT.
- Sertraline withheld: Lakeview 2026-07-13 (narrative-only span → `Chlorthalidone likely;
  ⟦withheld⟧.`), HomeLog 2026-05-02 (`med_5`, entry without span), Riverside H&P (depression and
  sertraline separable; `hx_mdd` has two spans, one unit). The word "sertraline" is absent from the
  decoded presentation.
- Views: K correction at Lakeview and Northgate with late-arriving originals hidden; atorvastatin
  void retracts the original, void stays current; transitive supersession; conflict; another issuer
  cannot hide items.
- Sync: paging (limit 2 → 2,2,2,2,1), other patient excluded, cursor skips to log end, appended
  file arrives alone and last, 400/410, client restart on 410, schema bytes match `sha256`.
- End to end: four nodes, agent syncs 31 items (pages of 3), 4 schemas and 4 DID docs, incremental
  re-sync gets 0, timeline 30 current + HomeLog typo page hidden, tampered feed fully rejected,
  presentations verify live and offline.

## Decisions

- **Library:** `@sd-jwt/core` 0.22.0 (OWF), with our own WebCrypto Ed25519 signer/verifier and
  SHA-256 hasher. It handles digests, unreferenced/duplicate disclosures, `alg: none`.
- **Ed25519 (`EdDSA`)**, not ES256: deterministic signatures, tiny keys, WebCrypto in Bun and browsers.
- **Claims:** `envelope` (whole envelope), `narrative` (prose segments around numbered slots),
  `units._sd`. One disclosure per unit `[salt, id, {entry?, pos?, spans?: [{slot, text}]}]`. Unit
  ids are hidden when withheld. No decoys (withheld count is exact), no `iat`/`exp`/`cnf`, no KB-JWT.
- **Exact Markdown round-trip:** the parser remembers the source frontmatter/payload text and reuses
  it if the content is unchanged; otherwise canonical output.
- **Sync:** JSON pages `{issuer, patient, items, next, more}`; the cursor is base64url of a log
  position; the dev node signs at load (fresh salts per start) and orders the initial directory by
  `recorded`, then appends. Readers dedupe on (issuer, id).
- Node base URL = the DID host's origin, mapped to localhost by `hostMap` for dev.

## Open questions

1. Authentication for feeds (sync.md leaves it out).
2. KB-JWT and audience binding for Stage 6 presentations.
3. Should the dev node persist its log/signatures so cursors and SD-JWT bytes survive restarts?
   (Currently re-signed at each start; harmless because of dedupe.)
4. Spec clarifications 10–13 in `work/stage2-spec-issues.md` (payload formatting not part of the
   item; blank-line trimming; paragraph rule; raw-HTML rule).
5. Corpus layout for `--items`: assumed `corpus/{source}` (any nesting; files found recursively).
6. Root `package.json` gained devDependencies (`bun-types`, `typescript`) and scripts. This may
   conflict trivially with the parallel worktree.
