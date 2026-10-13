# P — HomeLog (patient's own app)

HomeLog is a personal health diary on Linda's phone. A paired Bluetooth BP cuff and glucose meter
send readings to it, and she types diary notes and keeps her own medicine list. Nothing in it was
reviewed by a clinician. Items are issued and signed by `did:web:homelog.example`; the author
of every item is the patient (`urn:homelog:user:HL-U-58213`).

Schema: [`schema/homelog-v1.d.ts`](schema/homelog-v1.d.ts), entry type `HomeLogEntry`.

## Modeling style

- **Two kinds of item.** A *day page* per calendar day with entries (readings, doses, notes), and a
  *My Medicines list* item per save of the list. Both restate everything; edits produce a new item
  that `supersedes` the old one.
- **Patient's own words.** Day-page narrative is the diary text verbatim; each note is a `<ref>` span
  whose payload entry holds only the symptom tags she picked. Readings have no prose.
- **Local wall-clock times, no offset.** `"2024-10-31T08:22"`. The app does not know the time zone.
  The envelope `effective` is the bare date of the day page.
- **Values as the device shows them.** Glucose is stored in whatever unit the meter displayed;
  HomeLog never converts.
- **Self-reported medicines.** Names, strengths and directions as she typed them; RxNorm only when she
  picked from the app's search. The list can and does disagree with the clinics'.

## Entry types (5)

| `type` | What it is |
|---|---|
| `bp_reading` | Home BP (mmHg) + pulse, cuff-synced or typed |
| `glucose_reading` | Fingerstick glucose, `value` + `unit` (mg/dL or mmol/L), meal marker, HI/LO flag |
| `dose_log` | A dose she logged as taken/skipped (in practice: her insulin) |
| `diary_note` | A typed note; words in the narrative span, symptom tags in the payload |
| `my_med` | One medicine on her self-reported list, taking or stopped |

## Examples

| File | Shows |
|---|---|
| `2023-04-11-first-readings` | First readings; glucose 7.8 **mmol/L** |
| `2024-02-10-meter-unit-change` | Same day: 8.1 mmol/L in the morning, 162 mg/dL in the evening |
| `2024-10-31-stomach-bug` | Day 3 of gastroenteritis: "still taking my pills", glucose only 171 |
| `2025-08-19-insulin-typed-bp` | Insulin dose log; a typed BP with a typo (184/88) |
| `2025-08-19-bp-typo-fixed` | Superseding day page, BP corrected to 148/88 |
| `2026-05-02-my-medicines` | Her medicine list before the nephrology referral |

## Traps here

- **T6** glucose unit shift: mmol/L until 2024-02-10, mg/dL after; the unit is per reading.
- **T10** local times with no offset; the patient's zone (America/Chicago) is not in the item.
- **T13** prose-only facts: the gastroenteritis and "still taking my pills" (i.e. empagliflozin while
  not eating) exist only in diary text. The symptom tags say nausea/vomiting, never a cause.
- **T14** duplicates: a typed reading can duplicate a synced one; a superseded day page restates every
  reading, so counting entries across all items, not just current ones, double-counts.
- **T1-flavoured disagreement**: her list keeps Jardiance as `stopped` with her reason; she has no
  "held" status. Her list also disagrees with the clinics on purpose: a sliding Lantus dose ("12 if
  my sugar was over 200"), and OTC Advil that no clinic knows about.
- **T19** sertraline is one `my_med` entry (`med_5`), so it can be disclosed alone, without any
  depression problem or note — which is what Linda does in the referral exchange.
