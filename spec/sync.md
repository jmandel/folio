# Sync

Draft 0, 2026-10-13. Normative unless marked as an example or a note.

A **sync node** publishes one issuer's signed items as an append-only feed per patient, and serves
the schemas and the DID document that readers need to check them. The key words MUST, SHOULD and
MAY are used as in RFC 2119.

## Base URL

A node is reached at a base URL. By default this is the origin of the issuer's `did:web` host
(`did:web:lakeview-labs.example` → `https://lakeview-labs.example`); a reader MAY be configured
with another base URL. All paths below are relative to it. FOLIO does not define how a reader
learns a patient's id at an issuer; the patient (or her agent) supplies it.

## Endpoints

| Method and path | Returns |
|---|---|
| `GET /patients/{patient}/sync?since={cursor}&limit={n}` | one page of the patient's feed |
| `GET /folio/schemas/{file}.d.ts` | a schema file, at the path its `schema.url` names |
| `GET /folio/schemas/sha256/{hex}` | the same file, addressed by its SHA-256 |
| `GET /.well-known/did.json` | the issuer's DID document (for path-based DIDs, the `did:web` path) |

### Feed

`{patient}` is the patient's id at this issuer, URL-encoded. Both query parameters are optional.

Response `200`, `application/json`:

```json
{
  "issuer": "did:web:lakeview-labs.example",
  "patient": "LV-0072914",
  "items": ["<SD-JWT>", "<SD-JWT>"],
  "next": "<cursor>",
  "more": true
}
```

- `items` are signed items in [signing.md](signing.md) form, each with every disclosure. A node
  never withholds parts of an item: the feed is for the patient and her agents.
- Items appear in **log order**. The node's log is append-only: an item, once in the log, keeps its
  position, and new items are added at the end. Log order is not clinical order and need not be
  `recorded` order; readers sort by the envelope times.
- `next` is an opaque cursor. Passing it as `since` returns the items after everything this page
  covered. A page with no items still returns a `next` (possibly the same one), so polling is
  `since=next` in a loop.
- `more` is `true` when the node already holds further items for this patient after `next`. The
  reader SHOULD keep fetching until `more` is `false`.
- Without `since`, the feed starts at the beginning of the log.
- `limit` caps the number of items in the page. The node MAY return fewer, and MAY cap it.

Errors:

- `400`: malformed cursor or `limit`.
- `410`: the node can no longer honour this cursor (its log was rebuilt). The reader starts again
  without `since`.
- An unknown patient gets an empty page, not an error.

### Schemas

- The bytes served for a schema MUST NOT change. Both schema paths return the same bytes.
- A reader MUST check that the SHA-256 of the bytes it received equals the item's
  `schema.sha256` before using the file. A mismatch means the schema is unusable for that item; the
  item itself is still valid.

## Readers

- Verify every item per [signing.md](signing.md#verification) before storing it, with the
  expected issuer set to the node's issuer, and check that `envelope.patient` is the requested
  patient.
- Items are immutable and identified by (`issuer`, `id`). A reader de-duplicates on that pair, so
  receiving an item again (after a `410`, or from a restarted node that re-signed it with fresh
  salts) is harmless. A re-delivered item whose content differs is an issuer error; the reader keeps
  the first copy and reports it.
- Store the cursor only after the page's items are stored.
- Apply [corrections](record-item.md#corrections-supersession-and-retraction) after storing, over
  everything held from that issuer; a replacing item may arrive before or after the item it
  replaces.

## Not specified in this draft

Authentication and authorization of feed requests, push notification of new items, and
cross-issuer patient matching. The development node answers anyone on localhost.
