# Schema conventions

Draft 0, 2026-10-13. Normative unless marked as an example or a note.

Every payload names its type through the item's `schema` field: a `.d.ts` file, an exported type in it,
and the file's SHA-256. The schema is how a consumer, human or agent, learns what the issuer's native data
means. FOLIO does not ask sources to adopt a common model. It asks them to **describe their own model
honestly and completely**.

The test for a schema is practical: a capable reader who has never seen the source system should be able
to write a correct mapper from the schema and a few sample items alone. Anything that reader would need to
ask the source's developers belongs in the docstrings.

## The file

- A schema is one self-contained TypeScript declaration file (`.d.ts`). It MUST NOT import from other
  files, so that one hash pins everything a consumer needs.
- It contains type declarations and TSDoc comments only: no runtime code, no `declare module`.
- It MUST be served at a stable HTTPS URL, and the bytes at that URL MUST NOT change. A changed schema is a
  new file at a new URL (e.g. `visit-v3.d.ts`). Items keep pointing at the version they were written with.
- The file SHOULD start with a module comment saying which system and which part of it the schema covers,
  and how its items are produced (for example: "one item per signed outpatient visit note; vitals entered
  during the visit are included as entries").

## Entry types

- The type named by an item's `schema.type` is the **entry type**: the type of each value in the payload.
- The entry type SHOULD be a union of interfaces discriminated by a string-literal field named `type`.
  A schema with a single kind of entry MAY use one interface, which still carries a literal `type`.
- Each `type` value MUST be unique within the union.
- Prefer flat, readable interfaces. Nesting is fine where the source naturally nests (a panel with its
  component results), but don't invent structure the source doesn't have.

## Docstrings

Every exported type and every member of the entry union MUST have a docstring saying what one entry of that
type represents in the source system.

Every field MUST have a docstring unless its name and TypeScript type leave nothing to explain. When in
doubt, document it. A field docstring MUST say, where it applies:

- **Meaning**: what the value is, in clinical terms, not just a restatement of the name.
- **Units**: for every quantity. See [units](#units).
- **Code system**: for every coded value. See [codes](#codes).
- **Each enumerated value**: what each allowed value means, including status values and integer codes. A
  field whose values are `'active' | 'held' | 'discontinued'` must say what *held* means in this system and
  whether *discontinued* can be reversed.
- **Absence**: when the field is omitted or null, and what that means (unknown? not applicable? not yet
  resulted?).
- **Time**: which event a timestamp marks (ordered, collected, resulted, verified) and the time zone
  convention if values lack an offset.
- **Provenance quirks**: whether a value is as-entered or normalized, whether it can be free text, whether
  it is copied from another system.

TypeScript cannot attach a docstring to each member of a literal union, so enumerated values are documented
as a list in the field's docstring:

```ts
/**
 * Where the order stands.
 * - 'active': being taken as prescribed.
 * - 'held': paused by a clinician with intent to resume (e.g. around surgery). Not being taken now.
 * - 'discontinued': stopped; restarting requires a new order.
 */
status: 'active' | 'held' | 'discontinued';
```

## Units

- A quantity's unit MUST be knowable. Either the entry has a unit field next to the value (UCUM codes
  RECOMMENDED, e.g. `"mg/dL"`, `"10*3/uL"`), or the docstring states a fixed unit and the field name SHOULD
  include it (`systolic_mmhg`).
- If a source stores the same analyte in different units in different rows, the schema MUST say so; it
  MUST NOT hide this behind a single documented unit.

## Codes

- A coded value MUST identify its code system, either in the field name (`rxnorm`, `loinc`, `icd10cm`) or
  with a `system` property next to the code.
- Local codes are allowed and expected. Document what the local code space is (for example, "Riverside lab
  test codes, stable across years; see `name` for the display text"). If a standard code is sometimes
  present, say when.
- Code systems are named by URI or by a well-known name defined in the docstring. For standard systems use
  the usual names: `loinc`, `snomed`, `rxnorm`, `icd10cm`, `cvx`, `ucum`.

## Values as stored

Describe the data as the source really holds it. If a lab value is stored as text because it can be
`"<5"` or `"see comment"`, type it as `string` and say so. If a status is an integer, keep the integer and
document each value. A schema that looks cleaner than the data misleads every mapper written from it.

## Example: what good looks like

```ts
/**
 * Riverside Health outpatient medication orders.
 * One item per order event (new, dose change, hold, resume, stop) entered in the clinic EHR.
 */

/** One entry per change to a medication order. */
export type MedEntry = MedOrderEvent;

/** A change to one outpatient medication order. */
export interface MedOrderEvent {
  type: 'med_order_event';

  /** Riverside order number. Stable across all events for the same order. */
  order_id: string;

  /**
   * What happened to the order in this event.
   * - 'new': first prescription of this order.
   * - 'dose_change': same drug, new dose or frequency; the order stays active.
   * - 'hold': paused with intent to resume; the patient should not be taking it.
   * - 'resume': a held order is active again.
   * - 'stop': discontinued. A restart is a new order with a new order_id.
   */
  action: 'new' | 'dose_change' | 'hold' | 'resume' | 'stop';

  /** Drug as ordered. `rxnorm` is an RxNorm SCD or SBD CUI; absent for compounded or investigational drugs. */
  drug: { name: string; rxnorm?: string };

  /** Dose per administration. Unit is a UCUM code, almost always "mg" or "[iU]". Absent on 'stop' and 'hold'. */
  dose?: { value: number; unit: string };

  /** Free-text frequency as typed by the prescriber, e.g. "daily", "BID with meals". Not normalized. */
  frequency?: string;

  /** Prescriber's reason, free text. Present on most 'stop' and 'hold' events; often absent otherwise. */
  reason?: string;
}
```

## Example: what fails these conventions

```ts
export interface Med {
  id: string;
  st: number;          // no docstring: what do the values mean?
  drug: string;        // name? code? which system?
  dose: number;        // which unit?
  dt: string;          // which event does this date mark?
  flag2?: boolean;     // undocumented; can't be mapped
}
```

Each problem here is one a mapper author would have to guess at, and a wrong guess (treating `st: 2` as
active, assuming milligrams) produces output that type-checks and is clinically wrong.
