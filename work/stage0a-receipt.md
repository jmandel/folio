# Stage 0a receipt: record item and schema conventions

Produced: `spec/record-item.md`, `spec/schema-conventions.md`.

## Decisions

- Required envelope: `folio`, `id` (ULID), `issuer` (did:web), `patient` (issuer-local), `effective`
  (date-time or full date), `recorded`, `schema` (when there is a payload). Optional: `effective_end`,
  `author` {id, name, role}, `supersedes`, `retracts`.
- `kind` dropped: it is a mini global vocabulary (early binding) with blurry categories; `schema.type`
  plus compiled mappers do the routing.
- `schema` is an object {url, type, sha256}; `type` names the **entry** type (each payload value), not a
  payload wrapper.
- Entry unions discriminated by a literal `type` field (not `kind`).
- Separate `supersedes` and `retracts` arrays instead of v1's `retracted: true` flag. Only the same issuer
  may correct its items; supersession replaces entirely (no patches); a fork of two superseders is shown
  as a conflict.
- Ref spans: `<ref id>` only, no nesting or overlap, within one paragraph, may repeat an id; ids that
  have no payload entry are allowed as **narrative-only spans** (withholdable prose). Entries without spans
  are normal.
- Narrative: CommonMark, no raw HTML except `<ref>`, no images; may be empty.
- Markdown form: frontmatter, narrative, one trailing `json payload` fence. JSON form: envelope +
  `narrative` + `payload`.
- Schemas: single self-contained `.d.ts`, immutable at its URL, docstrings mandatory (meaning, units, code
  system, every enum value, absence, which time, as-stored quirks). Values typed as stored (text labs,
  integer statuses stay as they are).

## Rejected

- `kind` enum: early binding in disguise.
- Encounter field in envelope: grouping is source-specific; goes in payload.
- Multi-file schemas with imports: one hash should pin everything.
- Patch-style amendments: harder to read, verify, and redact.

## Open questions

1. Should `effective` also allow partial dates (`2019-06`) for historical facts? Currently full date
   minimum.
2. Narrative-only spans make prose withholdable; is that enough for the redaction story, or do we want
   whole-section withholding too?
3. Do we want an optional `encounter`-like grouping hint after Stage 0 schemas are drafted, if all three
   sources end up wanting one?
4. Sync filtering by `schema.type` is assumed; confirm when Stage 2 specs sync.
