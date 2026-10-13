# HomeLog — design notes and spec issues

> Stage 0c: the problems below were resolved (or left open) in `work/decisions.md` under "Stage 0c";
> see `work/stage0c-receipt.md` for what changed. This file is kept as the Stage 0b record.

## Decisions not settled by the spec or story

1. **Day pages, not one item per reading.** One item per local calendar day keeps the narrative
   readable (a diary page) and makes "edit a reading" a natural supersession. Cost: a day page with
   a late edit restates every reading, so naive consumers that ignore `supersedes` double-count
   (useful for T14 / the masked-hypertension cohort).
2. **Envelope `effective` is a bare date.** The spec requires RFC 3339 (with offset) or a full date.
   HomeLog has no offset, so the day page uses the date and each entry keeps a wall-clock
   `YYYY-MM-DDTHH:MM` string. This preserves T10 without breaking the envelope.
3. **Patient author id** is an issuer-scoped URN `urn:homelog:user:HL-U-58213`, same as the
   `patient` value. The patient has no did of her own in this story.
4. **New truth facts I added** (P-only; please confirm or I'll remove):
   - OTC ibuprofen ("Advil 200 mg, 2 when my knee acts up, maybe twice a week"). Clinically relevant
     to CKD and hyperkalemia, unknown to every clinic. Gives the self-reported list a real
     disagreement and a good question for the nephrology intake. If kept, it needs to enter
     `truth/` with visibility `{P: structured}` and probably a mention in the exchange.
   - Lantus self-titration ("10 units, 12 if my sugar was over 200"): disagreement with B's 10 u nightly.
   - Metformin as 500 mg tablets × 2 (same daily dose as B's 1000 mg BID, different product).
   - Her grandson "Marcus" switched the meter unit; previous My Medicines list id `01KMTFFYM012DNBYBDSS7S2EVN`
     (2026-03-28) exists but isn't shown.
5. **Specific values chosen** (HERO gives none for P): home BP ~136–148 / 82–88; fasting glucose
   7.8 mmol/L (2023-04-11), 8.1 mmol/L and 162 mg/dL (2024-02-10), 171 mg/dL on 2024-10-31 (the day
   before ED glucose 182 — the "sugar wasn't high" teaching point of euglycemic DKA), 212 mg/dL on
   2025-08-19.
6. **Kept-taking-empagliflozin stays prose-only.** HERO's modality matrix says P prose only, so
   dose logging is shown only for insulin (from 2025-08), and the 2024-10 notes say "my pills", not
   "Jardiance". A mapper must connect "my pills" to the med list to get empagliflozin; that's
   harder than HERO's wording implies. If the exchange stage needs the name, the note could say
   "still taking my pills, even the Jardiance".
7. **No disclosure-preference field.** The "hide mental health" choice is the Personal Agent's
   presentation policy, not record content, so `my_med` has no `private` flag.
8. **HI/LO meter flag** added (`out_of_range`) because real meters do this and it's a cheap,
   honest values-as-stored detail; no example uses it.
9. **Writeback to Northgate.** Entries are self-contained (unit on every glucose reading, med name
   copied onto every dose log). The one thing a Northgate importer cannot get from an item is the
   time zone; that is deliberate (T10). If writeback needs it, the Personal Agent should supply it,
   not HomeLog.

## Spec problems hit

1. **Partial dates in `effective`.** `decisions.md` allows them, but `spec/record-item.md` still says
   "RFC 3339 date-time or full date". Needs the edit. (HomeLog only needs full dates.)
2. **Local date-time without offset** is not an allowed `effective` form. That is probably right,
   but the spec should say what a source with only wall-clock time does (my answer: bare date in
   the envelope, wall time in the payload) so sources don't invent offsets.
3. **Supersession is the only correction path for patient edits**, and supersession replaces the
   whole item. Fine for day pages, but the spec could note that sources whose units of edit are
   smaller than an item will republish more than changed.
4. **Generated narrative.** The spec says to document generated narrative in the schema; it doesn't
   cover *partly* generated narrative (app-added time labels around verbatim patient text). I
   documented it in the module comment; the spec might say "mark which parts".
5. **Unexported helper types.** I used a non-exported `type LocalDateTime = string` alias for
   docs. Conventions say "every exported type" needs a docstring; they don't say whether helper
   aliases are allowed or how mappers should treat them. Worth a sentence.
6. **Ref span on an entry with no other content.** A `diary_note` entry's substance is its span text;
   the payload has only tags. Selective disclosure handles this (entry + span go together), but the
   spec example implies the payload is the "real" data. A sentence that a span may be the main
   content of its entry would help.
