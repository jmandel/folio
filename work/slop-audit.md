# Slop audit of site copy

Checklist: [slop-checklist.md](slop-checklist.md). Marker numbers refer to its rows. Line numbers are from the pre-edit files (commit 69f58222).

## site/src/views/Home.tsx (front page)

| Line | Before | Marker | After |
|---|---|---|---|
| 169 | "Health systems publish their records in their own shape, signed. A reader has an AI agent write the code that maps each shape into the views it needs, once, and runs that code for every read after." | 16 comma-clipped tails ("signed.", "once,") | "Each health system publishes signed records in its own data model. A reader uses an AI agent to write code that maps that model into the views the reader needs. The agent runs once per schema version; later reads run the saved code." |
| 175 | h2 "The problem" | 11, 12 label heading | "How records move between systems today" |
| 177 | "Today, records move between systems in one of two ways. Everyone agrees on one schema… which is slow, drops local detail, and separates notes… Or a system exports everything… which is complete but hard to use." | 1 counting ("one of two ways"), 2 triad, 9 vague ("hard to use") | "Either the systems agree on a schema in advance, or one system exports everything it holds. An agreed schema drops local detail that does not fit it, and usually carries notes separately from the coded data they describe. A full export, such as a Cures Act EHI export, is complete, but it comes in the vendor's own layout and each reader has to work that out." |
| 185 | h2 "The idea" | 11, 12 | "How FOLIO works" |
| 186 | "Let each system publish what it already has, and move the mapping to the reader." | 10 aphorism; repeats lede | cut |
| 191 | h2 "One fact in four records" | 1 count heading | "Empagliflozin reaction in each source" |
| 194 | "Here is how each system recorded it. Every excerpt is quoted from a signed item, and the signatures are checked in your browser." | 6, 8 signpost | "The excerpts below are quoted from signed items, and your browser checks each signature." |
| 219 | h2 "A short tour of the workbench" | 7 filler adjective | "Tour of the workbench" |
| 221 | step "A note and its data are one record" | 10 aphorism | "Note text linked to structured entries" |
| 222 | "…is tied to a structured entry. They are signed together, so either can be cited." | 9 vague | "…is marked as a reference to the `med_empa` entry. One signature covers both, and a citation can point at either." |
| 221–240 | link labels "Show me" (x4), "See a planted trap" | 8 teacher voice, 18 tease | "Open the discharge summary", "Northgate's schema", "Trap T1 in Northgate's record", "Open the Compiler view", "Open the sharing example" |
| 227 | step "Four systems, four shapes" | 1 count heading, 10 | "Source schemas and planted traps" |
| 233 | "…such as a drug that one system calls held and another calls stopped." | 9 vague where a specific fact exists | "In trap T1, the hospital marks empagliflozin held and the family doctor marks it stopped." |
| 236 | step "A mapper, written once and checked"; note "Mapper results are coming" | 10 slogan; 9 | "Recorded agent runs"; note "Mapper runs not recorded yet" |
| 237 | "An agent reads a schema and writes the mapping code, which is checked against an answer key. Today this view replays…" | describes unbuilt thing as present | "The Compiler view will replay runs in which an agent reads a schema, writes a mapper, and has it scored against answer keys. For now it replays the runs that wrote the notes in the test data." |
| 241 | "…The signatures still verify, but one sentence about her low sodium now reads differently." | 3 contrast, 18 promised reveal | "…withholds her depression treatment, sertraline. Every shared item still verifies. Without the sertraline, the nephrology note suggests chlorthalidone is the only suspected cause of her low sodium." |
| 244 | note "Coming" | 9 | "Not built yet" |
| 251 | h2 "What this is and isn't" | 4 negative parallelism heading | "About this site" |
| 254 | "It is a reference stack, small enough to read: a draft format, four example sources, and the tools around them. It is not a product." | 11 colon reveal, 2 triad, 3 denial nobody asked for | "This is a reference implementation of a draft format, with four synthetic sources and the code that signs, verifies and shares their records." |
| 278 | aria-label "How FOLIO works, in three stages" | 1 | "How FOLIO works" |
| 303 | "Narrative bound to structured data, a documented TypeScript schema, and a signature." | 2 triad of noun phrases | "A note and its structured data, signed by the issuer. A TypeScript schema documents the data." |
| 310 | "The mapper is checked against independent evidence." | 7, 9 vague | "The mapper is tested against answer keys the agent did not see." |
| 319 | "Plain code runs the cached mapper. No AI is involved." | 4 punchy negation | "The cached mapper runs as ordinary code, with no model call." |
| 326 | "The reader picks its views: its own small ones, or FHIR." | 11 colon reveal; repeats the list above it | cut |
| 390 | h3 "The same facts in a reader's views" | 14-ish restatement, vague | "Merged into a reader's views" |
| 391 | badge "Expected result (answer key)" | redundant with note | "Answer key" |
| 395 | "Compiled mappers are not built yet, so this is what they should produce, written by hand from the synthetic truth. Each part cites the source, item and ref it rests on." | run-on, "rests on" | "Mappers are not built yet. These rows were written by hand from the synthetic patient's underlying data, as the expected mapper output. Each part cites the source, item and ref it comes from." |

## site/src/story/dka.ts (front-page column captions)

| Line | Before | Marker | After |
|---|---|---|---|
| 32 | "A hospital document. At discharge the drug is held, not stopped, with advice not to restart it." | 12 label fragment, 3 "held, not stopped" | "The discharge summary marks the drug held, with advice not to restart it." |
| 37 | "An event log. A week later the family doctor stops the drug and adds a separate allergy event." | 12 label fragment | "A week later the family doctor records a stop event, and a separate allergy event." |
| 45 | "Coded rows. The DKA is a history diagnosis with status H. The decision not to re-try is in the prose only." | 12 label fragment | "The DKA is a coded history diagnosis (status H). The decision not to re-try the drug is only in the note text." |
| 56 | "Linda's own app. Only she wrote down that she kept taking her pills while she was sick." | 12 label fragment, 10 | "Linda's diary is the only record that she kept taking her pills while she was sick." |

## site/src/App.tsx (navigation)

| Line | Before | Marker | After |
|---|---|---|---|
| 51 | document title "FOLIO: native clinical records, compiled mappers" | 11 colon tagline | "FOLIO workbench" |
| 67 | nav group "Explore the data" | 7, 8 | "Views" |

## site/index.html

| Line | Before | Marker | After |
|---|---|---|---|
| 7 | meta description "Signed, native clinical record items from four synthetic sources: read them, check their signatures, share parts of them, and see how they were made." | 11 colon, 2 list rhythm | "Signed clinical records from four synthetic sources, each in its own data model. The workbench verifies the signatures in the browser and shows how the records were written and shared." |

## site/src/views/About.tsx

| Line | Before | Marker | After |
|---|---|---|---|
| 7, 74 | nav label and h1 "The idea" | 11, 12 | "Overview" |
| 76 | "…every system must translate into before it can send anything. FOLIO tries the other order." | 10 cute aphorism | "Health records usually travel in a shared format that each system translates into before sending. In FOLIO, each system publishes its data in its own model…" |
| 83 | "checked against independent evidence… Reading records afterwards is plain code; no model runs at read time. This is late binding with compiled mappers." | 7, 9 vague; 10 tagline | "tested against answer keys the agent did not see, and cached under the schema's hash. Later reads run the cached mapper; no model runs at read time. We call this late binding with compiled mappers." |
| 102 | "Start here to learn the format." | 8 signpost | cut |
| 105 | "Today these are the runs that wrote the test notes; the mapper runs will appear there too." | 9 | "So far these are the runs that wrote the notes in the test data. Mapper runs will be added." |
| 109 | h2 "What is not shown yet" | wordy | "Not built yet" |
| 111 | "…Those come from the compiler stage." | 9 | "Both depend on the compiler stage." (and tightened the sentence before it) |
| 117 | "specified in four short pages:" | 1 count, 11 colon | "specified in" |

Left as is: the Sharing bullet (Sharing is being redesigned by another agent).

## site/src/views/Record.tsx

| Line | Before | Marker | After |
|---|---|---|---|
| 278 | "These are deliberate. Each is something a mapper that only type-checks could get wrong. From the trap list." | 6 throat-clearing, fragment | "Each trap is a case a mapper could get wrong even when it type-checks. See the full trap list." |
| 305 | "Linda's record as four systems published it: a hospital, … Each system keeps its own data model. Items are merged here only by date." | 1 count, 11 colon | "Linda's record from a hospital, her primary care practice, a lab and kidney clinic, and her own app, each in its own data model. This view merges them by date only." |
| 306 | "A synthetic patient from the same four sources. Items are merged here only by date." | 1 | "A synthetic patient with records from the same sources. This view merges them by date only." |
| 332 | h2 "Places to start" | 8 signpost | "Example items" |

Kept: item labels (concrete), switch labels, signature status strings, "Change one character and check again" (says exactly what it does).

## site/src/views/Sources.tsx

| Line | Before | Marker | After |
|---|---|---|---|
| 196 | "Hand-written examples; the hero's record reproduces them exactly." | internal jargon ("hero") | "Hand-written examples. Each one appears unchanged in Linda's record." |

## site/src/views/Compiler.tsx

| Line | Before | Marker | After |
|---|---|---|---|
| 34 | "Mapper runs (schema to view) are being recorded in the next stage and will be listed here." | 9 | "Mapper runs (schema to view) are not recorded yet." |
| 170 | "Prose runs like this one build the test corpus. The compiler runs come next: for each source schema and target view, … Those runs, their code and their scores will be replayed here in the same way." | 11 colon reveal, 2 triad | "This run wrote notes for the test data. Mapper runs are not recorded yet. In each, an agent will write a mapper and its tests for one source schema and one target view, and the harness will score the mapper against answer keys built from the synthetic patients' clinical truth. Those runs will be replayed here with their code and scores." |

## Second pass (rendered page, work/copy-screens/home-1280x720-light-full.png)

- Nav group label "Workbench" (first rewrite) sat next to the "FOLIO workbench" wordmark, so it read twice. Changed to "Views".
- Tour step 4 said "depression treatment" and then "sertraline" with no link between them. Now "withholds her depression treatment, sertraline… Without the sertraline, …".
- Rechecked against the checklist: no count headings, colon reveals, "not X but Y", "Let's"/"Here is", em dashes, or bold-lead bullets left in scope.
