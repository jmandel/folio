# Record items

Draft 0, 2026-10-13. Normative unless marked as an example or a note.

A **record item** is the unit a source system publishes: one clinical event or document for one patient,
with optional readable narrative, an optional structured payload, and links between the two. Items are
immutable once published. Changes are new items that supersede old ones; items entered in error are
retracted.

The key words MUST, MUST NOT, SHOULD and MAY are used as in RFC 2119.

## Envelope fields

| Field | Required | Type | Meaning |
|---|---|---|---|
| `folio` | yes | string | Format version. This draft is `"0.1"`. |
| `id` | yes | ULID string | Identifier of the item, unique within the issuer. The global identity of an item is the pair (`issuer`, `id`). |
| `issuer` | yes | `did:web` URI | The organization or system that publishes and signs the item. |
| `patient` | yes | string | The patient's identifier **at this issuer**. FOLIO does not define a cross-issuer patient identifier. |
| `effective` | yes | RFC 3339 date-time with offset, or a full or partial date | When the clinical event happened or the observation applies (specimen collection, visit start, dose taken). A date (`2026-03-15`, `2026-03`, `2026`) is allowed when only that much is known. See [dates and times](#dates-and-times). |
| `effective_end` | no | same as `effective` | End of the period, for items that cover a span (an admission, a home-BP week). |
| `recorded` | yes | RFC 3339 date-time with offset | When the issuer committed this item. Monotonic per issuer is RECOMMENDED but not required. |
| `author` | no | object | Who authored the content: `id` (URI, e.g. `npi:1234567890`, `did:web:…`, or an issuer-scoped URN), `name` (display string), `role` (free text). Omitted for system-generated items such as an analyzer result. |
| `schema` | yes, if `payload` is present | object | The payload's type: `url` (HTTPS URL of a `.d.ts` file), `type` (name of the exported entry type in that file), `sha256` (lowercase hex SHA-256 of the file's exact bytes). See [schema conventions](schema-conventions.md). |
| `supersedes` | no | array of item ids | Items from the same issuer that this item replaces. See [corrections](#corrections-supersession-and-retraction). |
| `retracts` | no | array of item ids | Items from the same issuer that were entered in error and are withdrawn without replacement. See [corrections](#corrections-supersession-and-retraction). |

Rules:

- Unknown envelope fields MUST be ignored by readers and MUST NOT carry clinical content. Clinical
  content belongs in the narrative or the payload, where the schema describes it.
- `id` values MUST match the ULID text form (26 characters, Crockford base32). Sortable ids make sync
  logs easy to scan; readers MUST NOT infer clinical time from them.
- An item MUST have a non-empty narrative, a non-empty payload, or a non-empty `retracts`.

### Dates and times

- Envelope `effective` and `effective_end` MUST be either an RFC 3339 date-time with a UTC offset
  (`2024-11-01T21:40:00-05:00` or `2024-11-02T02:40:00Z`) or a date. `recorded` MUST be a date-time with
  an offset.
- A date MAY be partial: `2016`, `2016-06` or `2016-06-14`. The precision is the string's precision:
  `2016` means "some time in 2016", never 2016-01-01. Payload date fields MAY be partial in the same
  way; a source that stores imprecise dates differently (a full date plus a precision flag) keeps its
  own form and documents it.
- Payload date-times SHOULD carry an offset. A date-time without one (`2024-10-31T08:22`) is allowed
  only in a payload, and only when the source genuinely does not know the time zone (for example a
  patient app that records the phone's wall clock). The schema MUST say so for every such field. An
  issuer MUST NOT invent an offset it does not know; an item whose times are all zone-less uses a date as
  its `effective`.

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
be separately citable or disclosable:

```
Her <ref id="bp_1">blood pressure today was 152/94</ref>, so we increased lisinopril.
```

- Syntax is exactly `<ref id="ID">` … `</ref>`, with a double-quoted `id` attribute and no other
  attributes.
- `ID` MUST match `^[a-z][a-z0-9_]{0,63}$` and MUST be unique as a payload key or narrative-only id within
  the item.
- A ref id normally names a payload entry. A ref id with no payload entry is a **narrative-only span**:
  prose with nothing structured behind it that the issuer wants to be citable or withholdable on its own.
  Narrative-only spans are a normal tool, not a fallback. They serve two purposes:
  - **Citation anchor.** A fact that exists only as prose (a precipitant, a decision, "sick-day rules
    reviewed") can be cited as (`issuer`, item `id`, ref id) by a reader or an agent.
  - **Disclosure unit.** The span can be disclosed or withheld separately from the rest of the narrative
    (see [signing and disclosure](#signing-and-disclosure)).
- A span MAY be the main content of its entry. A patient's diary note, for example, can be a span whose
  payload entry holds only tags; the words are in the span.
- Several spans MAY share one id when the prose mentions the same fact twice. They are disclosed or
  withheld together.
- Spans MUST NOT nest or overlap. A span MUST lie within one paragraph or one list item; its content is
  inline Markdown only.
- A literal `<ref` in narrative text MUST be written `&lt;ref`. No other escaping is defined: other `<`
  characters (`Troponin I <0.01`) are ordinary text, so a parser MUST match the exact opening
  `<ref id="` rather than any `<`.
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
- Entry ids are local to their item. Nothing outside the item can address one entry except through the
  item's `id` (ref spans and disclosure work within the item).
- Entries MAY refer to other items by `id` (same issuer) or by `issuer` + `id`. They MAY also use the
  source's own identifiers (an accession number, an order id, another organization's record number).
  The schema documents such fields like any other. Resolving a source-native reference may need the
  issuer's whole log; matching records across issuers is the consumer's job.

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
  restate everything that is still true; it is not a patch. Use it whenever an item's content changes:
  a corrected lab value, a result the lab has invalidated (a hemolyzed potassium withdrawn by the lab is
  restated with its withdrawn status), an amended note, a patient's edit of a diary page. The superseded
  item stays in the history view.
- **Retract** (`retracts: [A, …]`): each listed item was **entered in error** (wrong patient, duplicate
  entry, a record that should never have existed) and nothing replaces it. Retraction is not for
  clinical corrections: a value that was real but later corrected or invalidated is superseded. The
  retracting item SHOULD have a narrative giving the reason and MAY have no payload. If its payload
  restates the retracted ids, the envelope `retracts` is authoritative.
- `supersedes` and `retracts` list **item ids only**. Payload entry ids are local to their item, so an
  issuer that needs to change or withdraw one entry supersedes the whole item with a restatement.
- Only the issuer of an item may supersede or retract it. A reader MUST ignore `supersedes` or `retracts`
  entries that point at another issuer's items.
- Supersession is transitive: if B supersedes A and C supersedes B, C replaces both.
- If two items both supersede the same item and neither supersedes the other, both are current. Readers
  SHOULD flag this as a conflict rather than pick one.
- A reader may see a superseding item before the item it supersedes (or never see the original). It MUST
  remember the replaced id so that a late-arriving original is hidden.

Times on correction items:

- A superseding item's `effective` describes the clinical event, as in the item it replaces (a corrected
  result keeps its collection time). `recorded` says when the correction was made.
- A retraction-only item (no payload other than an optional restatement of the retracted ids) describes
  no clinical event. Its `effective` is the time of the retraction action and equals `recorded` unless
  the schema says otherwise.

**Status changes are not corrections.** Supersession replaces an item's content; it is not the way to
model a change in clinical state. A medication put on hold, a problem resolved, or an order cancelled is a
new fact, and a source MAY record it as a new entry in a new item (a status-history row, a "hold" event)
while the earlier item stays current and unchanged. Both styles are legitimate. A source that uses status
rows MUST say in its schema how to compute the current state (for example: "the latest status row for the
prescription id wins").

### Default reader view

The default view of a patient's record from one issuer is every item that is not superseded or retracted
by another item from that issuer. Superseded and retracted items stay available in a history view for
audit and provenance; readers SHOULD let a user reach them from the item that replaced or retracted them.

## Signing and disclosure

Specified in `signing.md` (not yet written). Requirements this format must meet:

- The envelope is always disclosed and always covered by the issuer's signature.
- Each payload entry together with its ref spans, and each narrative-only span, is independently
  disclosable: a holder can present an item with some of them withheld, and a receiver can still verify the
  issuer's signature over what was disclosed.
- Narrative outside any ref span is disclosed as one unit, whenever the item is disclosed.
- A presentation with withheld parts MUST show, in place, that something was withheld. Receivers MUST
  NOT present a partial item as if it were complete.

### Span boundaries are disclosure boundaries

A payload entry, with its spans, is disclosed or withheld as a whole. An issuer therefore decides the
finest granularity a patient can disclose at when it chooses its entries and spans. Rules for issuers:

- Facts that are independently sensitive MUST NOT share one payload entry. A lab panel MAY nest its
  component results (they are disclosed together, and nobody needs one sodium without the panel). An
  encounter or document entry MUST NOT nest the medication list, diagnoses or other lists whose members a
  patient might disclose separately; each member is its own top-level entry.
- Facts that are independently sensitive MUST NOT share one span, and a sensitive fact MUST NOT appear in
  prose outside any span (that prose is disclosed with every presentation of the item).

Example: a hospital note says "Depression is stable. Continue sertraline 100 mg daily." If the
medication list were one nested entry, or the sentence one span, a patient could not show a kidney clinic
that she takes sertraline (relevant to her low sodium) without also showing her depression diagnosis.
Written as two spans, `<ref id="hx_mdd">Depression is stable.</ref> <ref id="med_sertraline">Continue
sertraline 100 mg daily.</ref>`, over two top-level entries, either can be disclosed alone.

The intended mechanism is SD-JWT (RFC 9901), with one disclosure per entry or span carrying its exact text
and JSON, which avoids any canonicalization of the Markdown.

## Examples

These examples are illustrative. Hashes and ULIDs are made up.

### A visit note with narrative and payload

~~~~markdown
---
folio: "0.1"
id: "01JB7Q3M5V8XKZ2N4R6T9WCYDE"
issuer: "did:web:maple-street-clinic.example"
patient: "MSC-448120"
effective: "2026-04-02T09:40:00-05:00"
recorded: "2026-04-02T10:12:31-05:00"
author:
  id: "npi:1952384017"
  name: "Dana Whitfield, MD"
  role: "Primary care physician"
schema:
  url: "https://maple-street-clinic.example/folio/schemas/visit-v2.d.ts"
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
issuer: "did:web:maple-street-clinic.example"
patient: "MSC-448120"
effective: "2026-04-02T09:55:00-05:00"
recorded: "2026-04-02T14:03:08-05:00"
schema:
  url: "https://maple-street-clinic.example/folio/schemas/lab-v1.d.ts"
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
  "issuer": "did:web:maple-street-clinic.example",
  "patient": "MSC-448120",
  "effective": "2026-04-02T09:55:00-05:00",
  "recorded": "2026-04-02T14:03:08-05:00",
  "schema": {
    "url": "https://maple-street-clinic.example/folio/schemas/lab-v1.d.ts",
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
