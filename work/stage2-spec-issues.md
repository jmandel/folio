# Stage 2: spec issues found while building core, sync and the Personal Agent

## Edits made to spec/record-item.md (all three are required by the new signing/sync specs)

1. **JSON form, last sentence.** Was: "In NDJSON sync streams each line is one item in this form."
   Sync carries *signed* items (SD-JWT), not the bare JSON form, and the page format is a JSON object
   rather than NDJSON. Now: "Sync feeds carry items signed (see sync and signing); verifying a signed
   item with nothing withheld yields this form."
2. **Signing and disclosure, first line.** "Specified in `signing.md` (not yet written)" → a link to
   signing.md.
3. **Signing and disclosure, last paragraph.** "The intended mechanism is SD-JWT…" → "The mechanism
   is…", plus links to signing.md and its context-loss section.

No normative rule in record-item.md changed.

## Issues resolved in the new specs, no edit to record-item.md

4. **Ref ids can be sensitive.** `na_sertraline`, `hx_mdd`, `med_sertraline` say what they are.
   signing.md puts the unit id inside the disclosure (an SD-JWT object-property disclosure), so a
   withheld unit's id is hidden. The prose carries numbered slots, not ids.
5. **Prose outside spans.** Specified as the `narrative` claim: an array of prose segments with the
   spans cut out (with their tags). Joining segments and spans restores the narrative byte for
   byte, so no Markdown canonicalization is needed.
6. **Payload key order** ("preserved but carries no meaning") must survive a full round-trip
   through signing. Each entry unit carries `pos`; withheld entries reveal only their count.
7. **Counting withheld parts.** Decoy digests are forbidden so a receiver can say exactly how many
   units were withheld. Withheld slots cannot be attributed to units (that would need a signed
   slot→unit link, which leaks that two spans are the same fact); the display says "N parts
   withheld, structured entries may be among them".
8. **The envelope is always shown and can itself be revealing** (author role, schema type).
   signing.md tells presenters to show this and that not sharing the item is the only remedy.
9. **Key binding.** Not used in 0.1; presentations must end with `~` and verifiers reject a KB-JWT.
   Revisit in Stage 6 (agent-to-agent), where binding to an audience and nonce matters.

## Clarifications worth considering (not edited)

10. **"Converting one to the other and back MUST yield the same item."** True at the item level.
    Byte-identical Markdown after md → JSON → md is not achievable for hand-formatted payloads
    (17 of 31 examples put short objects on one line, inconsistently). The core parser remembers
    the exact frontmatter/payload text it read and reuses it when the content is unchanged, so
    md → item → md is byte-exact for all 31 examples; items built in code get
    `JSON.stringify(payload, null, 2)`. The spec could say outright that payload JSON formatting is
    not part of the item.
11. **"Leading and trailing blank lines removed"** from the narrative: the code removes whole blank
    lines only and keeps leading spaces on the first text line. The spec could say so.
12. **"A span MUST lie within one paragraph or one list item."** The validator checks this
    heuristically (no blank line, no line starting with a list marker or heading inside a span); a
    full CommonMark parse is not used.
13. **Raw HTML rule.** The validator flags tag-like text `<name …>` other than `<ref>`; `<0.01`,
    `<5` and `>60` are text. Something like "BP <140/90" is fine; "<b>" is flagged.
14. **Sync log order vs `recorded`.** The spec recommends monotonic `recorded`; the dev node sorts
    the initial directory by `recorded` and appends later files at the end regardless, so log
    order and `recorded` order can differ (tested). sync.md says readers sort by envelope times.
15. **Patient-app issuer path.** No problem found: HomeLog items verify like the EHRs' items.
