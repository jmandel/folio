# Record items

Draft 0, 2026-10-13. Normative unless marked as an example or a note.

A **record item** is the unit a source system publishes: one clinical event or document for one patient,
with optional readable narrative, an optional structured payload, and links between the two. Items are
immutable once published. Corrections are new items that supersede or retract old ones.

The key words MUST, MUST NOT, SHOULD and MAY are used as in RFC 2119.

## Envelope fields

| Field | Required | Type | Meaning |
|---|---|---|---|
| `folio` | yes | string | Format version. This draft is `"0.1"`. |
| `id` | yes | ULID string | Identifier of the item, unique within the issuer. The global identity of an item is the pair (`issuer`, `id`). |
| `issuer` | yes | `did:web` URI | The organization or system that publishes and signs the item. |
| `patient` | yes | string | The patient's identifier **at this issuer**. FOLIO does not define a cross-issuer patient identifier. |
| `effective` | yes | RFC 3339 date-time or full date | When the clinical event happened or the observation applies (specimen collection, visit start, dose taken). A full date (`2026-03-15`) is allowed when only the date is known. |
| `effective_end` | no | same as `effective` | End of the period, for items that cover a span (an admission, a home-BP week). |
| `recorded` | yes | RFC 3339 date-time with offset | When the issuer committed this item. Monotonic per issuer is RECOMMENDED but not required. |
| `author` | no | object | Who authored the content: `id` (URI, e.g. `npi:1234567890`, `did:web:…`, or an issuer-scoped URN), `name` (display string), `role` (free text). Omitted for system-generated items such as an analyzer result. |
| `schema` | yes, if `payload` is present | object | The payload's type: `url` (HTTPS URL of a `.d.ts` file), `type` (name of the exported entry type in that file), `sha256` (lowercase hex SHA-256 of the file's exact bytes). See [schema conventions](schema-conventions.md). |
| `supersedes` | no | array of item ids | Items from the same issuer that this item replaces. See [corrections](#corrections-supersession-and-retraction). |
| `retracts` | no | array of item ids | Items from the same issuer that were entered in error and are withdrawn without replacement. |

Rules:

- Unknown envelope fields MUST be ignored by readers and MUST NOT carry clinical content. Clinical
  content belongs in the narrative or the payload, where the schema describes it.
- `id` values MUST match the ULID text form (26 characters, Crockford base32). Sortable ids make sync
  logs easy to scan; readers MUST NOT infer clinical time from them.
- An item MUST have a non-empty narrative, a non-empty payload, or a non-empty `retracts`.

### Why these fields and not others

- **No `kind` field.** The drafts had a coarse `kind` (`note`, `lab`, `med`, …). It is dropped: it would
  be a small global vocabulary every source must map into, which is exactly the early binding this format
  avoids, and the categories blur in practice (is a medication reconciliation a note or a med?). The
  schema reference already says precisely what an item contains, and a consumer's compiled mapper decides
  which of its views an item feeds. Sync filtering uses `schema.type`.
- **No encounter or episode field.** Grouping is source-specific. A source that groups items by encounter
  puts the encounter identifier in its payload and documents it in its schema.
- **`patient` is local.** Linking a patient across issuers is a separate problem (patient-mediated
  aggregation, or an MPI) and is out of scope for the item format.

## Narrative

The narrative is the human-readable part of the item: what a clinician would read.

- It is CommonMark Markdown. Raw HTML MUST NOT appear, with one exception: the `<ref>` element below.
  Images and embedded media MUST NOT appear; links MAY appear.
- It MAY be empty. A lab result with no comment is a complete item with a payload and no narrative.
- It SHOULD be the text the author actually wrote or signed, not text generated from the payload. If the
  narrative is generated, the issuer SHOULD say so in the schema documentation for that item type.

### Ref spans

A ref span marks a piece of narrative that is about a specific payload entry, or that the issuer wants to
be separately disclosable:

```
Her <ref id="bp_1">blood pressure today was 152/94</ref>, so we increased lisinopril.
```

- Syntax is exactly `<ref id="ID">` … `</ref>`, with a double-quoted `id` attribute and no other
  attributes.
- `ID` MUST match `^[a-z][a-z0-9_]{0,63}$` and MUST be unique as a payload key or narrative-only id within
  the item.
- A ref id SHOULD name a payload entry. A ref id with no payload entry is a **narrative-only span**: prose
  the issuer wants to be withholdable on its own (for example a sensitive aside), with nothing structured
  behind it.
- Several spans MAY share one id when the prose mentions the same fact twice. They are disclosed or
  withheld together.
- Spans MUST NOT nest or overlap. A span MUST lie within one paragraph or one list item; its content is
  inline Markdown only.
- A literal `<ref` in narrative text MUST be written `&lt;ref`. No other escaping is defined.
- Readers locate spans by character offset into the narrative after removing the ref tags. Offsets count
  Unicode code points.

## Payload

The payload is the structured part of the item: a JSON object whose keys are **entry ids** and whose
values are **entries**.

- Entry ids follow the same pattern as ref ids. An entry id and a ref id that are equal refer to the same
  thing.
- Every entry MUST conform to the type named by `schema.type` in the file named by `schema.url`. That type
  is normally a discriminated union, so each entry carries its own literal `type` tag (see [schema
  conventions](schema-conventions.md)).
- **Entries without a ref span are normal.** Structured-only data (most labs, vitals, administrations) is
  first-class; a ref span is added only where narrative actually discusses the entry.
- Key order is preserved but carries no meaning.
- Entries MAY refer to other items by `id` (same issuer) or by `issuer` + `id`; the schema documents such
  fields like any other.

## Serializations

An item has two equivalent forms. Converting one to the other and back MUST yield the same item.

### Markdown form (`.folio.md`)

For reading, grepping and diffing.

1. A YAML frontmatter block delimited by `---` lines, holding the envelope fields. Field order in
   examples is the RECOMMENDED order.
2. The narrative.
3. If the payload is non-empty, exactly one fenced code block with the info string `json payload`, as the
   last thing in the file. The fence MUST be longer than any backtick run inside the JSON. Nothing but
   whitespace may follow the closing fence.

The narrative is everything between the frontmatter and the payload fence, with leading and trailing blank
lines removed. A narrative MUST NOT itself contain a fence with the info string `json payload`.

### JSON form (`.folio.json`)

For streaming, columnar storage and signing. One JSON object: the envelope fields at top level, plus
`narrative` (string, the Markdown narrative with ref tags, `""` if none) and `payload` (object, `{}` if
none). In NDJSON sync streams each line is one item in this form.

## Corrections: supersession and retraction

Items are never edited. To change the record, the issuer publishes a new item.

- **Supersede** (`supersedes: [A, …]`): the new item replaces each listed item **entirely**. It MUST
  restate everything that is still true; it is not a patch. Typical uses: a corrected lab value, an
  amended note, a repeat draw replacing a hemolyzed specimen.
- **Retract** (`retracts: [A, …]`): each listed item was entered in error and nothing replaces it. The
  retracting item SHOULD have a narrative giving the reason and MAY have no payload.
- Only the issuer of an item may supersede or retract it. A reader MUST ignore `supersedes` or `retracts`
  entries that point at another issuer's items.
- Supersession is transitive: if B supersedes A and C supersedes B, C replaces both.
- If two items both supersede the same item and neither supersedes the other, both are current. Readers
  SHOULD flag this as a conflict rather than pick one.
- A reader may see a superseding item before the item it supersedes (or never see the original). It MUST
  remember the replaced id so that a late-arriving original is hidden.

### Default reader view

The default view of a patient's record from one issuer is every item that is not superseded or retracted
by another item from that issuer. Superseded and retracted items stay available for audit and provenance;
readers SHOULD let a user reach them from the item that replaced them.

## Signing and disclosure

Specified in `signing.md` (not yet written). Requirements this format must meet:

- The envelope is always disclosed and always covered by the issuer's signature.
- Each payload entry together with its ref spans, and each narrative-only span, is independently
  disclosable: a holder can present an item with some of them withheld, and a receiver can still verify the
  issuer's signature over what was disclosed.
- Narrative outside any ref span is disclosed as one unit.
- A presentation with withheld parts MUST show, in place, that something was withheld. Receivers MUST
  NOT present a partial item as if it were complete.

The intended mechanism is SD-JWT (RFC 9901), with one disclosure per entry or span carrying its exact text
and JSON, which avoids any canonicalization of the Markdown.

## Examples

These examples are illustrative. Hashes and ULIDs are made up.

### A visit note with narrative and payload

~~~~markdown
---
folio: "0.1"
id: "01JB7Q3M5V8XKZ2N4R6T9WCYDE"
issuer: "did:web:riverside-health.example"
patient: "RH-448120"
effective: "2026-04-02T09:40:00-05:00"
recorded: "2026-04-02T10:12:31-05:00"
author:
  id: "npi:1952384017"
  name: "Dana Okafor, MD"
  role: "Primary care physician"
schema:
  url: "https://riverside-health.example/folio/schemas/visit-v2.d.ts"
  type: "VisitEntry"
  sha256: "3f1a9c0e5b7d2468ac13579bdf02468ace13579bdf02468ace13579bdf02468a"
---
## Follow-up: hypertension, type 2 diabetes

Home readings have averaged in the 150s systolic. <ref id="bp_1">Office BP today 152/94</ref>,
repeat 148/92. She reports no cough or lightheadedness on the current dose.

Plan: <ref id="med_1">increase lisinopril from 10 mg to 20 mg daily</ref>. Recheck
<ref id="ord_1">basic metabolic panel in 2 weeks</ref> for potassium and creatinine.

```json payload
{
  "bp_1": {
    "type": "vital",
    "measure": "blood_pressure",
    "systolic_mmhg": 152,
    "diastolic_mmhg": 94,
    "position": "sitting"
  },
  "bp_2": {
    "type": "vital",
    "measure": "blood_pressure",
    "systolic_mmhg": 148,
    "diastolic_mmhg": 92,
    "position": "sitting"
  },
  "med_1": {
    "type": "med_change",
    "action": "dose_change",
    "drug": { "rxnorm": "314077", "name": "lisinopril 20 MG Oral Tablet" },
    "previous_dose": { "value": 10, "unit": "mg" },
    "new_dose": { "value": 20, "unit": "mg" },
    "frequency": "daily"
  },
  "ord_1": {
    "type": "order",
    "test": { "loinc": "51990-0", "name": "Basic metabolic panel" },
    "due": "2026-04-16"
  }
}
```
~~~~

Note: `bp_2` (the repeat reading) has no ref span; the prose mentions it in passing but the issuer chose
not to tag it. That is allowed.

### A lab result with no narrative

~~~~markdown
---
folio: "0.1"
id: "01JB9D0R2K7M4P6S8V1X3Z5B7C"
issuer: "did:web:riverside-health.example"
patient: "RH-448120"
effective: "2026-04-02T09:55:00-05:00"
recorded: "2026-04-02T14:03:08-05:00"
schema:
  url: "https://riverside-health.example/folio/schemas/lab-v1.d.ts"
  type: "LabEntry"
  sha256: "8e2b4d6f0a1c3e5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a"
---

```json payload
{
  "a1c": {
    "type": "result",
    "test": { "loinc": "4548-4", "local_code": "HBA1C", "name": "Hemoglobin A1c" },
    "value": 7.9,
    "unit": "%",
    "reference_range": { "high": 5.6 },
    "flag": "H",
    "status": "final",
    "specimen_collected": "2026-04-02T09:55:00-05:00"
  }
}
```
~~~~

The JSON form of the same item:

```json
{
  "folio": "0.1",
  "id": "01JB9D0R2K7M4P6S8V1X3Z5B7C",
  "issuer": "did:web:riverside-health.example",
  "patient": "RH-448120",
  "effective": "2026-04-02T09:55:00-05:00",
  "recorded": "2026-04-02T14:03:08-05:00",
  "schema": {
    "url": "https://riverside-health.example/folio/schemas/lab-v1.d.ts",
    "type": "LabEntry",
    "sha256": "8e2b4d6f0a1c3e5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a"
  },
  "narrative": "",
  "payload": {
    "a1c": {
      "type": "result",
      "test": { "loinc": "4548-4", "local_code": "HBA1C", "name": "Hemoglobin A1c" },
      "value": 7.9,
      "unit": "%",
      "reference_range": { "high": 5.6 },
      "flag": "H",
      "status": "final",
      "specimen_collected": "2026-04-02T09:55:00-05:00"
    }
  }
}
```
