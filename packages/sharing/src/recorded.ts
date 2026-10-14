// A recorded conversation between Linda and her agent, replayed when no API key is set. Written by
// hand against the five default referral items and the rules in this package; the tests check that
// every policy in it parses and does what the agent says it does.

import type { PresetId } from "./categories.ts";

export interface RecordedTurn {
  role: "user" | "assistant";
  content: string;
  /** Set on the turn where Linda's agreement takes effect: its policy is applied when it is shown. */
  applies?: boolean;
}

export const RECORDED_MODEL = "recorded example";

/** The choice the conversation starts from. Its text describes this choice and the five default records. */
export const RECORDED_START: PresetId = "private";

export const RECORDED: RecordedTurn[] = [
  {
    role: "user",
    content: "I don't want the kidney doctor to know about my depression, but I don't want to get bad advice either.",
  },
  {
    role: "assistant",
    content: `Your depression shows up in five parts of what you're sending:

- the depression diagnosis in your 2024 hospital admission note
- sertraline on the medicine lists in that note and in your discharge summary
- sertraline on your own medicine list in HomeLog
- one sentence in the kidney clinic's July note: "sertraline (disclosed at intake) may contribute"

Right now all five are held back. The one that could affect your care is the sodium question. Your sodium has been low (129 in the hospital, 132 in the kidney clinic's July note). Sertraline can lower sodium, and the kidney clinic's note names it as a possible cause. With it hidden, the clinic's note reads as if your water pill (chlorthalidone) were the only suspect, so a doctor might change that pill and overlook sertraline.

One option is to keep the diagnosis private but list sertraline with your other medicines. The clinic would see that you take sertraline. Most doctors know it is often used for depression or anxiety, so they may guess. They would not see the diagnosis, when it started, or the line that says your depression is stable.

\`\`\`policy
{"private": ["mental_health", "substance_use", "sexual_reproductive", "hiv_sti", "genetic"], "shareMedicines": true, "overrides": {}}
\`\`\``,
  },
  {
    role: "user",
    content: "If they can guess from the pill, what's the point of hiding the diagnosis?",
  },
  {
    role: "assistant",
    content: `The diagnosis says more than the pill does. It names major depressive disorder, says it has come back more than once, and gives 2019 as the start. Sertraline on its own could be for anxiety or something else, and the clinic would have no details.

Whether that difference matters is up to you. Either way, the clinic will see a "withheld" marker in the admission note and a count of what was held back, so they will know something is missing, though not what.

Another choice is to keep everything private and tell the kidney doctor at your visit that you take an antidepressant. That works too, as long as you remember to say it.`,
  },
  {
    role: "user",
    content: "OK. Share the sertraline, but nothing else about the depression.",
  },
  {
    role: "assistant",
    applies: true,
    content: `Done. Four parts change from held back to shared: sertraline on the two hospital medicine lists, sertraline on your HomeLog list, and the kidney clinic's sentence about sertraline and sodium.

Still private: the depression diagnosis in the admission note, including the line "Depression is stable." The clinic will see two "withheld" markers in that note.

\`\`\`policy
{"private": ["mental_health", "substance_use", "sexual_reproductive", "hiv_sti", "genetic"], "shareMedicines": true, "overrides": {}}
\`\`\``,
  },
];
