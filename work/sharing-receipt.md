# Sharing view receipt: policies instead of checkboxes

This work is on branch `sharing` (worktree `.worktrees/sharing`) and has not been pushed. The
category sources and the design reasons are in [sharing-notes.md](sharing-notes.md).

## What changed

| Path | What it is |
|---|---|
| `packages/sharing/` | New package `@folio/sharing`. It has no runtime dependencies and runs in the browser. |
| `packages/sharing/src/categories.ts` | Five categories: mental health, alcohol and drug use, sexual and reproductive health, HIV and STIs, genetic tests. Three presets. The `Policy` type, `presetOf` and the referral purpose. |
| `packages/sharing/src/rules.ts` | Rules written as data: ICD-10-CM ranges, RxNorm ids, LOINC codes, medicine names, condition words, and Northgate's `restricted: "BH"` flag. Also where these sit in each source schema, which entry types are medicines, and the context rules (antidepressant → low sodium, lithium → kidney disease). |
| `packages/sharing/src/classify.ts` | `CategorySource`, an interface with one rule-backed source and `viewRowSource` for compiled view rows. |
| `packages/sharing/src/policy.ts` | `decide(parts, policy, sources)` gives a share or withhold decision for each unit, with the reason and the rule hits. `suggestions()` finds refinements that would reduce context loss. |
| `packages/sharing/src/agent.ts`, `recorded.ts` | The system prompt and the `policy` reply block parser, plus the recorded example conversation. |
| `site/src/views/Sharing.tsx`, `SharingChat.tsx`, `sharing.css` | The rewritten view (described below). |
| `site/scripts/screens.ts` | Sharing smoke checks for each preset and for the refinement. New screenshot views: `sharing-*`. |
| `spec/signing.md` | A short non-normative note under Presentations. It says the choice of units is a policy layer above the profile. |

### The view

The left column is a panel styled as Linda's app. From top to bottom:

1. **Purpose line.** It names who the records go to and why.
2. **Three presets.** Each one says what the clinic sees, what it does not see, and how many parts it holds back.
   - Share everything.
   - Keep sensitive topics private. This is the default.
   - Keep sensitive topics private, but list all my medicines.
3. **Suggestion box.** It appears only when the policy hides a medicine that may explain something the clinic will see. For Linda it reads "Keeping mental health private also hides sertraline…", with a one-click fix.
4. **Topic toggles.** One per category, each showing its count in these records, plus the medicine switch.
5. **"What this means in your records".** Collapsed by default. It lists every part for each record:
   - a checkbox to override the decision;
   - a badge, the reason, and each rule that matched (id, field, matched value, reason);
   - parts not tied to a private topic, folded together;
   - what each record always shares;
   - Don't send and Add another record.
6. **"Talk it over with your assistant".** Optional and collapsed. With an OpenRouter key stored in localStorage, it calls the model live. The default model is `anthropic/claude-sonnet-5.5`, a list suggests three other real ids, and any id can be typed. Without a key, it replays the recorded conversation. Each proposed policy shows what it would change and has an Apply button.

The right column (verification, partial banners, withheld markers, context-loss quotes) is unchanged in behavior. The search check now uses words taken from the withheld parts' rule hits that appear in no shared part, for example "F33.0", "depression", "depressive", "sertraline".

Deep links: `?preset=everything|private|private_meds` (the old `off` still works), `?detail=1`, `?chat=recorded`, `?s=context-loss` (unchanged).

## Verification

**`bun test packages/sharing`: 17 pass.** The tests read Linda's items from `corpus/` and split them into units the way the signer does. They check that:

- the five referral items have 67 units;
- "Keep sensitive topics private" withholds exactly `hx_mdd` and `med_sertraline` (H&P), `med_sertraline` (discharge), `med_5` (HomeLog) and `na_sertraline` (Lakeview);
- the default policy produces exactly one suggestion, `antidepressant-low-sodium`, citing `dx_na` and the admission `bmp` as evidence;
- applying the suggestion gives `private_meds`, and only `hx_mdd` stays withheld;
- across all 1,238 units of the hero record, the rules withhold the same 16 units the old text pattern caught, all of them mental health;
- overrides, ICD ranges, `viewRowSource`, the prompt and the reply parser behave as intended;
- the recorded conversation's policies parse and do what its text says ("Four parts change…").

**Whole suite: `bun test` gives 259 pass, 3 skip.**

**`bun run typecheck`.** The site is clean. The same 8 errors as before remain, all in `packages/truth`.

**`bun site/scripts/screens.ts` (site:check smoke).** All 1,478 items verify in Chromium, and the tamper check fails as it should.

| Sharing state | Presentations verified | Parts withheld | Words found in what is sent |
|---|---|---|---|
| Keep sensitive topics private | 5/5 | 5 of 67 | none of "F33.0", "depression", "depressive", "sertraline" |
| Share everything | 5/5 | 0 | (no check) |
| List all my medicines | 5/5 | 1 | none of "F33.0", "depression", "depressive" |
| Default, then click the suggestion | 5/5 | 1 | preset becomes `private_meds` |

The front page and its deep links still pass, including `#/sharing?s=context-loss`.

**Screenshots.** `work/sharing-screens/` holds 24 PNGs: 1280×720 and 390×844, light and dark, for each of these states:

- `sharing` (default)
- `sharing-everything`
- `sharing-meds`
- `sharing-detail`
- `sharing-chat` (recorded conversation)
- `sharing-chat-applied`

## Known gaps

- **The live OpenRouter path is not tested end to end.** No key was available. The request shape follows OpenRouter's chat completions API, and errors are shown in the panel.
- **The rule lists are illustrative, not maintained value sets.** Word rules can misfire ("ST depression"). Dual-use medicines are left out on purpose.
- **Always-shared parts are never classified.** These are the author's role and the prose outside spans. The view tells Linda what each record always shares.
- **The recorded conversation is written for the five default records.** If records are added or removed, the replay's counts no longer match. The Apply preview still shows the true effect.
- **The bundle grew by about 50 kB.** It is now 575 kB (199 kB gzip).
