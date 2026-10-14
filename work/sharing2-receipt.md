# Sharing view receipt: descriptions computed from the records and the current choice

Branch `sharing2` (worktree `.worktrees/sharing2`), not pushed. It follows [sharing-receipt.md](sharing-receipt.md).

## What changed

| Path | Change |
|---|---|
| `packages/sharing/src/describe.ts` (new) | `describeShare(decisions, …)` names the sensitive things in the records being sent ("your depression diagnosis", "sertraline") and says where each one is. It also gives the categories that occur and those that do not. `topicState` and `absentText` drive the topic list. |
| `packages/sharing/src/rules.ts` | `PLAIN_NAMES`: plain names for conditions and tests, matched by ICD-10 prefix, LOINC code or word. |
| `packages/sharing/src/categories.ts` | The fixed `sees` / `notSees` prose is removed from the presets. Each category has an `about` phrase. |
| `packages/sharing/src/policy.ts` | `suggestions(decisions)` works from the decisions alone. It fires whenever a medicine is withheld while a shared part shows the finding, including when the medicine was withheld by a per-part choice. `apply(policy)` replaces `patch`. |
| `packages/sharing/src/recorded.ts` | `RECORDED_START = "private"`. The last reply has `applies: true`. Facts are corrected (see below). |
| `packages/sharing/src/agent.ts` | The prompt describes each preset and the current state with `describeShare`. It also tells the model that settings can change between messages and that it should propose changes to the current policy. |
| `site/src/views/Sharing.tsx` | Choice texts, Custom card, topic list, suggestion box and context-loss note are all computed. Record names come from `plainNames` ("your July kidney-clinic note"). |
| `site/src/views/SharingChat.tsx` | The replay is tied to a state: Play sets the start choice, the "Done" turn applies its policy, and a mismatch is shown with a "Replay from the start" button. Each live reply keeps the settings it was based on. |
| `site/scripts/screens.ts` | New state checks (below), a `--no-smoke` flag, and new screenshots `sharing-custom` and `sharing-chat-stale`. `sharing-chat` now shows two turns (`&turns=2`). |

## Visible strings changed

### Choices (left panel)

Removed: the fixed "The clinic sees: …" and "The clinic does not see: …" lines for all three presets, and "Holds back N parts of these records." / "Holds back nothing in these records."

Now computed for every choice and shown on all three cards. With the five default records:

- **Share everything:** "The clinic will see everything in these five records, including your depression diagnosis and sertraline."
- **Keep sensitive topics private:** "The clinic will not see your depression diagnosis (in your November 2024 hospital admission note) and sertraline (on three medicine lists and in one sentence of your July kidney-clinic note). It will see everything else in these five records."
- **Keep sensitive topics private, but list all my medicines:** "The clinic will not see your depression diagnosis (in your November 2024 hospital admission note). It will see sertraline (on three medicine lists and in one sentence of your July kidney-clinic note), and everything else in these five records. Doctors know what sertraline is usually taken for, so the clinic may guess why you take it."
- **Custom** (was "Your own choice"): the same generator runs on the current policy. The line "Holds back N parts of these records. Pick a choice above to start over." becomes "Pick a choice above to start over."

These facts were checked against the data:

- **The depression diagnosis.** `hx_mdd` (F33.0, "Depression, recurrent, mild…", "Depression is stable.") appears only in the 2 Nov 2024 admission H&P.
- **Sertraline on three medicine lists.** These are the `home_med` entries in the H&P and in the discharge summary, and `med_5` on the May 2026 HomeLog list.
- **Sertraline in one sentence.** This is `na_sertraline` in the 13 Jul 2026 Lakeview note.
- **Five records.** This is the default record set.

If a record is removed, the counts change. For example, removing HomeLog and Lakeview gives "…sertraline (on two medicine lists). It will see everything else in these three records." This is covered by a test.

### Topic list

- The legend "Topics you keep private" is now "Private topics".
- The five rows, each with fixed `covers` prose and "N parts in these records" or "Nothing in these records", are replaced. There is now one row per category that occurs in these records; here that is Mental health only:
  - Checkbox "Keep mental health private". It is ticked when the category is private.
  - "Kept private: …" and/or "The clinic will see: …", naming the things. A thing that is partly shared is listed with where it is on each side, for example "sertraline (in one sentence of your July kidney-clinic note)".
- One quiet line for the absent categories: "These records contain nothing about alcohol or drug use, sexual or reproductive health, HIV or other sexually transmitted infections, or genetic tests."
- The medicine switch "List all my medicines, even ones for a private topic" is now "List sertraline with my other medicines". Its text: "Listing sertraline shows the clinic its name and dose, not your depression diagnosis. Doctors know what sertraline is usually taken for, so they may guess why you take it." The switch is shown only when a private topic includes a medicine in these records. The old version was disabled but visible.

### Suggestion box

- The heading "Keeping mental health private also hides sertraline" is now "Hiding sertraline may mislead the clinic about your low sodium".
- The body is now "{rule text} The clinic will see your low sodium in your November 2024 hospital admission note, your November 2024 hospital discharge summary, and your July kidney-clinic note. If they don't know you take sertraline, they may look for another cause." The evidence records come from the rule's evidence parts.
- Removed: "You can list sertraline with your other medicines and still keep the diagnosis private."
- The button "Share sertraline, keep the diagnosis private" is now "Share sertraline, keep your depression diagnosis private".

### Context-loss note (right column)

- **When it shows.** It used to show whenever anything was withheld. It now shows only when a context problem exists, which in these records means sertraline is withheld while low sodium is shared.
- **Heading.** "Withholding can change what the rest of a note means" is now "Withholding sertraline changes what the clinic reads about low sodium".
- **Body.** It is now "{rule text} The clinic will see low sodium in {records}. It will not see sertraline ({where})." followed by "Here is what the clinic will read where sertraline was removed:".
- **Quotes.** Only the runs that contain a withheld sertraline part are quoted, taken from the verified presentation. Each quote has "Removed here: “…”", using the span text of each withheld slot.
- **Removed.** The fixed chlorthalidone sentence, "Linda's app finds this case…", and the always-shared-parts sentence are gone. What remains is "See context loss in the signing spec."

### Assistant panel

- The intro "…suggests a choice." is now "…suggests a change to your current settings."
- "Showing a recorded conversation." is now "This example conversation starts from “Keep sensitive topics private”." followed by either "Playing it switches to that choice, and applies the change when Linda agrees to it." or "The change is applied when Linda agrees to it."
- **When the settings no longer match.** The panel shows "Your settings no longer match this conversation. It is written for the five default records and starts from “Keep sensitive topics private”." with the button "Replay from the start". The old "Replay" button is now "Replay from the start" in both places.
- **Proposals.** "Suggested choice: holds back N of M parts. Shares …" is now "Suggested change: Shares …. N of M parts held back after this change." On the turn that takes effect, the label is "Applied:". Recorded proposals have no Apply button and are measured against the conversation's own state at that point.
- **Stale live replies.** A live reply made under different settings shows "Your settings changed after this reply. The change shown is from your current settings."
- **Error text.** "The suggested choice could not be used" is now "The suggested change could not be used".

### Recorded conversation text

- "Your depression shows up in five places" is now "…in five parts". The diagnosis has two spans, so "places" was wrong.
- "Your sodium has been low (129 in the hospital, 132 in February), and the kidney clinic is trying to work out why." is now "(129 in the hospital, 132 in the kidney clinic's July note). Sertraline can lower sodium, and the kidney clinic's note names it as a possible cause." The February lab is not among the records being sent.
- "…might change that pill and leave the real cause alone" is now "…and overlook sertraline". The note only says sertraline "may contribute".
- "The clinic will see one "withheld" marker there." is now "…two "withheld" markers in that note". `hx_mdd` fills two slots.
- Removed the paragraph about the four absent topics.

## Verification

- **`bun test`:** 264 pass, 3 skip, 0 fail. The 8 new tests in `packages/sharing/test/policy.test.ts` cover:
  - the exact text, withheld labels and shared labels for each preset;
  - a custom state with a per-part choice, including the partly-shared topic lines;
  - a custom state made by unticking mental health, which gives the same text as Share everything;
  - present and absent categories, plus the absent line;
  - the description changing when the record set changes;
  - the context problem being present exactly when sertraline is withheld, across five states;
  - the replay's start choice and its single applying turn.
- **`bun run site:build`:** OK.
- **`bun run site:check`:** 0 failures. New browser checks:
  - Each preset and two custom states (mental health unticked, and mental health ticked from Share everything) are checked for the exact choice text, the topic rows and their tick state, the Kept private / will see lines, the absent line, the absence of per-topic "Nothing in these records" rows, and the context note being present exactly when sertraline is withheld.
  - Taking the suggestion is checked.
  - Chat: Play switches Share everything to Keep sensitive topics private, it stays there through turn 2, and it becomes the medicines choice when the "Done" turn shows. Picking Share everything then shows the mismatch notice, and Replay from the start resets the choice.
- **`bunx tsc -p site/tsconfig.json`:** clean.
- **Screenshots:** `work/sharing2-screens/` has 1280×720 shots, light and dark, of `sharing`, `sharing-everything`, `sharing-meds`, `sharing-custom` (medicines listed, but the kidney-clinic sentence withheld by hand), `sharing-detail`, `sharing-chat` (two turns in), `sharing-chat-applied` and `sharing-chat-stale`.

## Known gaps

- **Record names come from a small mapping by source and title.** It covers the hospital, kidney clinic, primary care and HomeLog records. Other titles fall back to "hospital {title}" or "Lakeview {title}".
- **"Sentence" counts span texts.** A marked phrase is called a sentence even when it is part of one, as with the kidney-clinic phrase.
- **The live OpenRouter path is still untested end to end.** No key was available.
