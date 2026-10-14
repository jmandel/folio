// Linda's own agent: the system prompt it gets, and how its replies turn into a policy.
//
// The agent proposes; the patient applies. A reply may end with one fenced ```policy block holding
// a JSON policy. The site shows what the policy would do and applies it only when she says so.

import { CATEGORIES, PRESETS, PURPOSE, presetOf, type CategoryId, type Policy } from "./categories.ts";
import { decide, type Decision, type Suggestion } from "./policy.ts";
import { describeShare } from "./describe.ts";
import { RULES } from "./rules.ts";

export interface ItemSummary {
  /** Same key as Part.item. */
  key: string;
  title: string;
  source: string;
  date: string;
  /** How Linda's app names it in a sentence ("your July kidney-clinic note"). */
  name?: string;
  /** What is always shared with this item (issuer, author and role, type, dates, prose outside parts). */
  alwaysShared: string;
}

export interface AgentContext {
  items: ItemSummary[];
  decisions: Decision[];
  /** One line per part, for the agent (the site's entry summary or span text). */
  partSummary: (d: Decision) => string;
  policy: Policy;
  suggestions: Suggestion[];
}

export function systemPrompt(ctx: AgentContext): string {
  const cats = CATEGORIES.map((c) => `- \`${c.id}\` (${c.label}): ${c.covers}`).join("\n");
  const names = (key: string) => {
    const it = ctx.items.find((i) => i.key === key);
    return { name: it?.name ?? `the ${it?.title ?? key}`, medicineList: /medicine list/i.test(it?.name ?? "") };
  };
  const opts = { names, partLabel: (d: Decision) => ctx.partSummary(d).slice(0, 60), records: ctx.items.length };
  const parts = ctx.decisions.map((d) => d.part);
  const presets = PRESETS.map((p) => `- "${p.label}" ${JSON.stringify({ private: p.policy.private, shareMedicines: p.policy.shareMedicines })}: ${describeShare(decide(parts, p.policy), opts).text}`).join("\n");
  const now = describeShare(ctx.decisions, opts).text;
  const rules = RULES.map((r) => `- ${r.id} → ${r.category} (${r.basis}): ${describeMatch(r.match)}. ${r.because}`).join("\n");
  const items = ctx.items
    .map((it) => {
      const parts = ctx.decisions
        .filter((d) => d.part.item === it.key)
        .map((d) => {
          const cats = d.categories.length ? ` [${d.categories.join(", ")}${d.medicineOnly ? ", medicine only" : ""}]` : "";
          return `  - \`${d.key}\`: ${ctx.partSummary(d)}${cats} → ${d.share ? "shared" : "WITHHELD"}`;
        })
        .join("\n");
      return `### ${it.title} (${it.source}, ${it.date})\nAlways shared: ${it.alwaysShared}\n${parts}`;
    })
    .join("\n\n");
  const sugg = ctx.suggestions.length
    ? ctx.suggestions.map((s) => `- ${s.rule.plain} Withheld now: ${s.hidden.map((d) => d.key).join(", ")}. Shared and showing ${s.rule.finding}: ${s.evidence.map((d) => d.key).join(", ")}.`).join("\n")
    : "- None under the current policy.";
  return `You are Linda Okafor's own assistant inside her health app. You work for her, not for any clinic. She is deciding what parts of her health records to send to ${PURPOSE.recipient}.

Purpose of this share: ${PURPOSE.why}

How sharing works:
- Each record is signed by the place that wrote it. Linda can withhold parts (one structured entry, or one marked phrase in a note) but cannot edit anything.
- The clinic sees a "withheld" marker where a phrase was removed and a count of how many parts were withheld. It cannot see what they were.
- Some things are always shared with a record: who wrote it, their role, the record type, dates, and the note text outside the removable parts. The only way to hide those is not to send that record.
- Withholding can change what the rest of a note means. Example: if the clinic's note says "Chlorthalidone likely; [withheld]", it reads as if the water pill were the only suspected cause of low sodium.

Her choices:
1. A preset:
${presets}
2. Which categories are private:
${cats}
3. shareMedicines: when true, a part that is only about a medicine (no diagnosis or note about the condition) is shared even if its category is private.
4. Overrides for single parts, by key: "share" or "withhold". These win over everything else.

Rules that assign categories (deterministic; you cannot change them, but you can override single parts):
${rules}

The records she is sending and what the current policy does with each part:

${items}

Current policy, as of this message: ${JSON.stringify(ctx.policy)} (${presetOf(ctx.policy) === "custom" ? "custom" : `preset "${PRESETS.find((p) => p.id === presetOf(ctx.policy))!.label}"`})
What Linda's app tells her about the current policy: ${now}
She can change her settings between messages. Earlier messages in this conversation may describe settings that no longer apply; always reason from the current policy above, and make any proposed policy a change to it.

Concerns the site has found with the current policy:
${sugg}

How to help:
- Write for a general reader. Short sentences, no jargon; explain any medical term you must use. No headings.
- Find out what she wants kept private and what she is worried about. Then say plainly what the clinic would and would not see, and what could go wrong for her care.
- Be honest about what a medicine can reveal: doctors know what most medicines are used for.
- Do not push her toward sharing. It is her decision. You may suggest she tell the doctor something in person instead.
- Do not give treatment advice. You can say why the kidney clinic might need a piece of information.
- When you propose a change, end your reply with exactly one fenced block tagged policy, holding the complete policy as JSON:
\`\`\`policy
{"private": ["mental_health"], "shareMedicines": true, "overrides": {}}
\`\`\`
  Use category ids and part keys exactly as written above. She will see the result and decide whether to apply it. If you are only answering a question, leave the block out.`;
}

function describeMatch(m: (typeof RULES)[number]["match"]): string {
  if ("icd10" in m) return `ICD-10-CM ${m.icd10.join(", ")}`;
  if ("rxnorm" in m) return `RxNorm ${m.rxnorm.join(", ")}`;
  if ("loinc" in m) return `LOINC ${m.loinc.join(", ")}`;
  if ("medicines" in m) return `medicine names ${m.medicines.join(", ")}`;
  if ("terms" in m) return `words ${m.terms.join(", ")}`;
  return `field ${m.field} = ${m.equals}`;
}

export interface ParsedReply {
  /** The reply without the policy block. */
  text: string;
  policy?: Policy;
  /** Set when a policy block was present but unusable. */
  error?: string;
}

export function parseReply(reply: string, knownKeys?: Set<string>): ParsedReply {
  const re = /```policy\s*\n([\s\S]*?)```/g;
  const blocks = [...reply.matchAll(re)];
  const text = reply.replace(re, "").trim();
  if (!blocks.length) return { text };
  try {
    const raw = JSON.parse(blocks[blocks.length - 1][1]);
    const ids = CATEGORIES.map((c) => c.id) as string[];
    const priv = (raw.private ?? []) as unknown[];
    const bad = priv.filter((c) => !ids.includes(String(c)));
    if (bad.length) return { text, error: `unknown categor${bad.length > 1 ? "ies" : "y"}: ${bad.join(", ")}` };
    const overrides: Policy["overrides"] = {};
    for (const [k, v] of Object.entries((raw.overrides ?? {}) as Record<string, unknown>)) {
      if (v !== "share" && v !== "withhold") return { text, error: `override for ${k} must be "share" or "withhold"` };
      if (knownKeys && !knownKeys.has(k)) return { text, error: `no part ${k} in these records` };
      overrides[k] = v;
    }
    return { text, policy: { private: priv as CategoryId[], shareMedicines: !!raw.shareMedicines, overrides } };
  } catch (e) {
    return { text, error: `the policy block is not valid JSON (${(e as Error).message})` };
  }
}
