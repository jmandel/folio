Here is the complete, revised **v2 Manifesto, Technical RFC, Walkthrough, Blind Agent Benchmark, and Reference Implementation Plan** for **FOLIO**, incorporating every architectural fix, SD-JWT selective disclosure (with zero canonicalization tax), recall-preserving population queries, narrative-to-payload semantic mapper verification, and rich conversational A2A interoperability.

---

# FOLIO: Federated Open Longitudinal Information Objects
## A Manifesto & Technical Blueprint for Healthcare Interoperability in the Era of Software 3.0

---

## Part 1: The Manifesto — From Early Binding to Verified Late Binding

### 1. The Lineage: CDA, FHIR, and Cures Act EHI Export
Modern healthcare interoperability rests on three historical milestones, each solving a vital piece of the puzzle while exposing the next bottleneck:

1. **HL7 CDA (and C-CDA)** established the core clinical principle that a medical artifact must bind human-readable, legally attestable narrative (`<text>`) to machine-readable structure (`<entry>`). However, its structured layer was trapped in the HL7 v3 RIM XML labyrinth, and in practice, its narratives devolved into auto-generated tables divorced from the clinician’s actual prose.
2. **HL7 FHIR (and SMART)** brought healthcare onto the modern web—introducing RESTful JSON APIs, OAuth2 apps, web-native cryptography (`did:web` / SMART Health Cards), and asynchronous bulk data exports (Flat FHIR). FHIR was designed in 2011 for an era where **compute was semantically blind, so data had to be exhaustively pre-structured.** Every clinical nuance had to be agreed upon in advance by a committee, constrained into an Implementation Guide, and mapped by every hospital into a single global schema (*Early Binding*).
3. **Cures Act `(b)(10)` EHI Export** quietly introduced the opposite paradigm: instead of forcing data through a lossy, pre-balloted global profile, it mandated that EHRs export *all* native electronic health information alongside machine-readable schema documentation (*Late Binding*). Yet raw EHI exports today are typically dumps of thousands of disconnected TSV/JSON tables divorced from narrative context and nearly impossible to operationalize without an army of data engineers.

### 2. The Software 3.0 Thesis
Today, the fundamental constraint of 2011 has inverted. Frontier AI models and coding agents can inspect a documented local database schema and write a deterministic, unit-tested parser in seconds. They can cross-check structured flowsheet outputs against clinical prose to catch semantic errors.

In this new reality, **forcing the entire healthcare ecosystem to lossily cram clinical nuance into a single upfront global schema is the primary bottleneck.** At the same time, running an LLM at runtime over every single patient record on every read is slow, expensive, and non-deterministic.

**FOLIO (Federated Open Longitudinal Information Objects)** bridges this gap. It takes the late-binding completeness of EHI Export, the narrative-to-structure binding of CDA, and the web-native ergonomics of SMART/FHIR, and unifies them around five core principles:

### 3. The Five Core Principles of FOLIO

1. **Put AI in the *Compiler* Loop, Not the *Runtime* Loop (Verified Late Binding):**
   Systems export their native data structures alongside clean, self-describing TypeScript definitions (`.d.ts` with rich semantic docstrings). Receiving systems use AI agents *once per schema version* to generate, test, and cache deterministic transformation code and SQL queries. Crucially, the compiler harness uses the paired clinical narrative as a **Semantic Oracle** to verify that a mapper that *type-checks* is also *clinically accurate* before caching it.
2. **Unify the Narrative and the Data (Fulfilling CDA’s Promise):**
   Heal the split between clinical notes (`DocumentReference`) and atomic resources (`Observation`, `Condition`). Every **Record Item** binds human-readable Markdown narrative directly to native structured JSON payloads via inline span references (`<ref id="...">`).
3. **Sync-First, Grep-First Ergonomics:**
   Instead of requiring transactional EHR servers to implement complex graph query languages, standardize a dead-simple **append-only synchronization primitive** (`GET /sync?since=cursor`). Let single-patient apps and population data lakes use fast, standard tools (`ripgrep`, DuckDB/SQL, WASM UDFs, and LLMs) over synced records.
4. **Selective Disclosure & Portable Trust via SD-JWT + `did:web`:**
   Data must retain institutional provenance when routed through a patient's Personal Agent or across external networks, without violating minimum-necessary privacy. Every Record Item is signed by the issuing institution’s `did:web` key using **SD-JWT (Selective Disclosure JWT, RFC 9901)**. Individual `<ref>` narrative spans and payload entries are signed as salted disclosure digests—requiring **zero JSON/Markdown canonicalization** while allowing a patient or provider to selectively disclose a single verified lab or diagnosis span without exposing the entire note.
5. **Conversational Interoperability (Agent-to-Agent Interactive Workflows):**
   Healthcare is not just static chart sync; it is interactive clinical negotiation—referrals, care coordination, patient intake, clinical trial screening, and coverage adjudication. Where static schemas end, FOLIO defines an **Agent-to-Agent (A2A) Protocol** where organizational and personal agents converse, clarify clinical ambiguity, and dynamically exchange structured TypeScript contracts backed by selectively disclosed SD-JWT proofs.

---

## Part 2: Concrete Walkthrough — FOLIO in Action

Let’s trace how FOLIO operates across three connected workflows: **Authoring & Selective Disclosure**, **Recall-Preserving Population Discovery**, and **Conversational Agent-to-Agent Interop**.

### Scenario A: Authoring, Sync, and SD-JWT Selective Disclosure
Dr. Alice Smith at **Mercy Oncology** sees patient **Jane Doe** for non-small cell lung cancer (NSCLC). Instead of splitting this visit across a dozen endpoints or dumping undocumented database rows, Mercy emits a single **FOLIO Record Item**:

~~~~markdown
---
id: "rec_01J8Z9X2A"
patient: "mercy_pat_99812"
effective_time: "2026-03-15T14:22:00Z"
recorded_time: "2026-03-15T14:25:10Z"
issuer: "did:web:mercy.org"
author_id: "npi:1234567890"
author_name: "Alice Smith, MD"
kind: "note"
supersedes: null
schema_uri: "https://mercy.org/schemas/onc_visit_v3.d.ts#sha256=4a8b9c..."
sd_jwt: "eyJhbGciOiJFZERTQSIsImtpZCI6Im1lcmN5LTIwMjYifQ.eyJfc2QiOlsi..."
---
### Oncology Follow-Up
Jane returns for restaging of her <ref id="dx_1">Stage IV EGFR Exon 19 del NSCLC</ref>. 
She also discussed <ref id="psych_1">ongoing anxiety regarding her divorce, currently 
managed with sertraline</ref>.
Unfortunately, <ref id="img_1">CT chest today shows a new 1.8cm RLL nodule</ref>, representing 
disease progression after 14 months on <ref id="med_1">osimertinib 80mg daily, which we are 
discontinuing today</ref>. Her <ref id="perf_1">ECOG performance status remains 1</ref>.

```json:payload
{
  "dx_1": {
    "kind": "diagnosis",
    "local_code": "ONC-4412",
    "icd10": "C34.90",
    "histology": "Adenocarcinoma",
    "biomarkers": [{ "gene": "EGFR", "variant": "Exon 19 deletion", "status": "positive" }]
  },
  "psych_1": {
    "kind": "psych_note",
    "condition": "Generalized anxiety disorder",
    "med": "sertraline 50mg"
  },
  "img_1": {
    "kind": "imaging",
    "impression": "Progressive disease (RECIST 1.1)",
    "dicom_manifest_url": "https://mercy.org/blobs/dicom/study_88219.json"
  },
  "med_1": {
    "kind": "medication",
    "drug_name": "osimertinib",
    "rxnorm": "1726061",
    "dose_value": 80,
    "dose_unit": "mg",
    "status": "discontinued",
    "stop_reason": "progression"
  },
  "perf_1": {
    "kind": "performance",
    "scale": "ECOG",
    "score": 1
  }
}
```
~~~~

And at `https://mercy.org/schemas/onc_visit_v3.d.ts`, Mercy hosts its native, self-describing TypeScript definition:

```typescript
/** Mercy Cancer Center — Outpatient Visit Extraction Schema (v3) */
export type MercyOncVisitPayload = Record<string, MercyOncEntry>;

export type MercyOncEntry =
  | OncDiagnosis
  | PsychNoteEntry
  | OncImagingSummary
  | OncMedication
  | PerformanceStatus;

export interface OncDiagnosis {
  kind: 'diagnosis';
  local_code: string;
  /** ICD-10-CM code when mapped by Mercy billing/problem list; may be absent on draft notes */
  icd10?: string;
  histology: string;
  biomarkers?: Array<{ gene: string; variant: string; status: 'positive' | 'negative' | 'equivocal' }>;
}

export interface OncMedication {
  kind: 'medication';
  drug_name: string;
  /** RxNorm CUI when mapped in Mercy formulary; unmapped investigational drugs omit this */
  rxnorm?: string;
  dose_value: number;
  dose_unit: 'mg' | 'mcg' | 'g' | 'mL' | 'units';
  /** 
   * 'active': patient currently taking.
   * 'held': temporarily paused (intend to resume).
   * 'discontinued': permanently stopped.
   */
  status: 'active' | 'held' | 'discontinued';
  stop_reason?: 'toxicity' | 'progression' | 'patient_preference' | 'completed' | { other: string };
}
// ... (remaining discriminated union interfaces)
```

**How the SD-JWT Signature Works (Zero Canonicalization, Full Selective Disclosure):**
Instead of canonicalizing the Markdown or signing a monolithic blob, Mercy’s server constructs an **SD-JWT (RFC 9901)**:
* The base JWT signs the immutable envelope metadata (`id`, `patient`, `effective_time`, `issuer`, `schema_uri`) plus an `_sd` array of SHA-256 digests.
* Each `<ref id="k">` span (both its exact raw UTF-8 narrative string and its raw JSON payload string) is packaged as an independent base64url-encoded SD-JWT disclosure `[salt, "dx_1", { text: "Stage IV...", data: {...} }]`.
* When Jane’s Personal Agent later shares her oncology history with a clinical trial or an external specialist, she can strip out the `psych_1` disclosure (her anxiety and divorce details) while presenting `dx_1`, `img_1`, `med_1`, and `perf_1`—and the receiver can still cryptographically verify Mercy Hospital’s signature over every disclosed element without any canonicalization rules.

---

### Scenario B: Recall-Preserving Population Discovery (The 3-Stage Funnel)
A clinical trial group wants to query across an institution’s FOLIO repository for:
> *"NSCLC with EGFR Exon 19 deletion, progressed specifically on osimertinib (not stopped due to toxicity), ECOG 0–1, and Platelets $\ge 100 \times 10^3/\mu\text{L}$ in the last 30 days."*

Notice that in real health systems, some clinics record standard codes (`icd10: 'C34.90'`, `rxnorm: '1726061'`), some record uncoded local flowsheet columns (`stop_reason: 'progression'`), and some community affiliates only dictate free-text notes with minimal structured payload.

FOLIO’s **Population Query Engine** resolves this without upfront ETL by running a **Union-Then-Intersect 3-Stage Funnel**:

1. **Stage 1 — Parallel Structured SQL $\cup$ Lexical Trigram Index (High-Recall Candidate Bitmaps):**
   For each clinical criterion $C_i$, the query agent inspects the institution’s `.d.ts` catalog and generates *both* a deterministic DuckDB SQL predicate (using standard codes like `icd10`/`rxnorm` where available *plus* local column names/units) *and* a lexical regex query for the full-text trigram index (`ripgrep` / Tantivy) over the Markdown narratives:
   $$\text{Candidates}(C_i) = \text{SQL\_Matches}(C_i) \cup \text{Lexical\_Matches}(C_i)$$
   * *Why the Union matters:* If a patient’s EGFR mutation or osimertinib progression was only mentioned in an unstructured pathology or transfer note, $\text{Lexical\_Matches}(C_i)$ catches them even when $\text{SQL\_Matches}(C_i)$ returns empty.
2. **Stage 2 — Cross-Criterion Bitmap Intersection (& Binary WASM Pushdown):**
   The engine intersects the candidate patient bitmaps across all required criteria:
   $$\text{Surviving\_Cohort} = \bigcap_{i} \text{Candidates}(C_i)$$
   If a criterion requires analyzing binary blobs (e.g., *"no QTc prolongation $> 500\text{ms}$ on raw 12-lead ECG waveform"*), a sandboxed WASM filter runs only over the binary blobs of the surviving intersection.
3. **Stage 3 — Last-Mile Agentic Verification (Precision & Provenance):**
   Only the surviving candidate charts are passed to parallel LLM workers. The LLM reads the longitudinal Markdown+JSON slices to verify clinical nuance (e.g., confirming osimertinib was stopped for *progression* rather than *pneumonitis*, and verifying unit conversions) and outputs a deterministic cohort table where every cell cites a verified `(rec_id, ref_id)` span.

---

### Scenario C: Conversational Interoperability (Agent-to-Agent Clinical Negotiation)
Static data sync cannot solve interactive workflows where context is missing, clinical judgment is required, or two parties must negotiate next steps. Examples include:
* **Specialist Referral & Triage:** An Endocrinology Clinic Agent interviewing a Primary Care Agent (or the patient’s Personal Agent) to clarify whether a thyroid nodule workup is urgent before slotting an appointment.
* **Clinical Trial Pre-Screening:** A Trial Sponsor Agent conversing with a Patient’s Personal Agent to check unwritten eligibility criteria ("Are you able to travel to Boston once a month, and have you had any recent eye symptoms?") before scheduling consent.
* **Coverage & Prior Authorization:** A Provider Agent fulfilling a Payer’s published coverage policy schema and resolving clinical edge cases.

**How the FOLIO A2A Protocol Works:**
1. **Session & Capability Handshake:** Agent A connects to Agent B over HTTPS/MCP, exchanging OAuth/OIDC tokens and capability declarations (what actions the agent can take autonomously vs. what requires human-in-the-loop sign-off).
2. **Published Contract + Conversational Resolution:**
   Suppose Jane’s oncologist refers her to a **Phase II Trial at Metro Cancer Institute**. Metro publishes a static, versioned TypeScript contract for trial intake (`MetroTrialIntake_v2.d.ts`), requiring confirmation of EGFR status, washout period since last osimertinib dose, and baseline symptom check.
   * Mercy’s Clinic Agent auto-populates 80% of `MetroTrialIntake_v2` directly from Jane’s FOLIO log, attaching the SD-JWT disclosures for `dx_1` and `med_1` from `rec_01J8Z9X2A`.
   * Metro’s Trial Agent inspects the submission and replies conversationally: *"I verified the SD-JWT for EGFR Exon 19 and osimertinib discontinuation on March 15. However, the note doesn't state the exact date of her last physical dose (for the 14-day washout rule), and we need confirmation she has no active corneal ulceration. Can you clarify with the patient or care team?"*
   * Mercy’s Agent routes that single targeted question to Jane’s Personal Agent (or the clinic nurse’s task queue), gets the signed attestation, completes the TypeScript contract, and receives a booked intake slot.

---

## Part 3: Technical Architecture & Solving the Hard Problems

### 3.1 Who Checks the Mappers? (The Narrative-to-Payload Semantic Oracle)
The hardest risk in "AI in the compiler loop" is **semantic error**: an agent reads `MercyOncVisit.d.ts` and writes a TypeScript mapper that compiles with zero TypeScript errors, but accidentally maps `"status": "held"` as active, or misses a unit conversion (`100` vs `100,000 / µL`).Furthermore, if the same agent writes both the mapper and the unit tests from the `.d.ts` alone, the test is circular.

FOLIO solves this by exploiting its core structural property: **every Record Item contains two representations of the same clinical event—the human prose (`<ref>` spans) and the JSON payload.**

When the **FOLIO Compiler Agent** generates a deterministic mapper `transform(payload: SourceSchema): TargetView` for a new `schema_uri`:
1. **Static Compilation:** The code must pass strict `tsc --noEmit` against the source `.d.ts` and target `.d.ts`.
2. **Cross-Modal Semantic Verification (The Oracle Check):** The compiler harness pulls $N$ sample Record Items (e.g., $N=20$) that use that `schema_uri`.
   * **Path A (Deterministic Code):** Runs the newly compiled `transform(item.payload)` function on the JSON payload.
   * **Path B (Independent Prose Oracle):** Strips the JSON payload completely and asks an independent verifier model to extract the target fields *solely from the human-readable Markdown narrative and `<ref>` text*.
   * **Discrepancy Check:** If Path A (compiled code on JSON) outputs `active_med: "osimertinib"` while Path B (reading the doctor’s prose *"osimertinib 80mg daily, which we are discontinuing today"*) outputs `status: "discontinued"`, the harness flags a **Semantic Discrepancy**, feeds the counterexample back to the compiler agent, or escalates for human review before the mapper is ever cached for production!

### 3.2 Identity Resolution Across Institutions
FOLIO does not require a single global national patient ID to function:
* **Patient-Mediated Aggregation:** When a patient’s Personal Agent syncs from Mercy (`mercy_pat_99812`) and Valley Clinic (`valley_4410`), the Personal Agent holds both OAuth grants and links the streams locally, verified by each institution's signed `kind: "admin"` Demographics Record Item.
* **Institutional / HIE Aggregation:** Institutions exchange signed `kind: "admin"` Record Items containing demographic traits and deterministic/probabilistic MPI (Master Patient Index) cross-links (`also_known_as: [{ issuer: "did:web:valley.org", patient: "valley_4410", confidence: 0.99 }]`).

### 3.3 Compaction, Amendments, and Write-Back Staging
* **Append-Only Compaction:** To correct a lab or amend a note, a system appends a new Record Item with `supersedes: ["rec_OLD_ID"]` (and `retracted: true` if entered in error). Sync clients deterministically hide superseded items from default views while preserving the audit trail.
* **Two-Tier Write-Back:** When an external app or Personal Agent writes data back to an EHR:
  1. *Chart Filing:* The signed Record Item is appended to the log; its Markdown is immediately readable by any clinician.
  2. *Inbox Assimilation:* The EHR’s compiler agent maps the incoming structured payload into staged flowsheet/med-rec rows for 1-click clinician sign-off.

---

## Part 4: The "Blind Agent Benchmark" (Testing Usability & Defeating Obfuscation)

How do we ensure vendors actually document their `.d.ts` schemas clearly rather than exporting cryptic tables (`{ "col_1": 99, "flag": "B" }`)?

In FHIR, certification tests **Syntactic Conformance** against fixed profiles. In FOLIO (and potentially today’s Cures Act EHI Exports!), certification tests **Zero-Shot Agentic Readability** via an automated, controlled ablation benchmark.

### 4.1 The Certification Protocol
1. **The Gold Synthetic Cohort:** A reference suite of synthetic patients with known ground-truth clinical trajectories (including subtle edge cases: canceled vs. active meds, corrected potassium labs, unit shifts between `mg` and `mcg`, and findings recorded only in prose vs. structured tables) is loaded into the system and exported as a FOLIO repository.
2. **Air-Gapped Ensemble Evaluation:** An ensemble of standardized, open-weights Reference Agents—with **zero prior access to the vendor's schema**—is given only the exported `.d.ts` files and sample records, and tasked with:
   * Compiling deterministic TypeScript mappers into standard clinical views (Active Meds, Longitudinal Labs, Problem List).
   * Compiling SQL + Lexical population queries for 25 clinical cohort definitions.
3. **Diagnostic Scoring Rubric (Separating Syntax from Semantics):**
   Instead of a brittle binary pass/fail, the benchmark measures three distinct rates against the ground-truth cohort:
   * **Compile Rate:** Does the generated mapper/SQL execute without syntax or type errors?
   * **Silent Semantic Error Rate (The Critical Metric):** How often does the generated mapper *compile cleanly* but produce clinically wrong outputs (e.g., including discontinued meds as active, failing to filter out `retracted` records, or misinterpreting units)?
   * **Provenance Accuracy:** Do the extracted facts point to the correct `(rec_id, ref_id)` spans?

---

## Part 5: Master Implementation Plan — Building the Reference Stack

We will build a complete, runnable **FOLIO Reference Stack** in **TypeScript + Bun** that both proves the core scientific hypothesis (Can compiler agents reliably map heterogeneous schemas without silent semantic errors, and does the Blind Agent Benchmark detect documentation degradation?) *and* demonstrates the full multi-system ecosystem in action.

### 5.1 Repository Structure & Tech Stack
* **Runtime:** **Bun** (native TypeScript execution, `bun:sqlite`, fast HTTP servers, subprocess spawning).
* **Analytical & Search Engine:** **DuckDB** (columnar SQL over JSON/Parquet) + **`ripgrep` (`rg`)** for lexical trigram search + **WebAssembly** for binary waveform filtering.
* **Cryptography:** `@sd-jwt/core` + `jose` for Ed25519 SD-JWT signing, selective disclosure per `<ref>` span, and `did:web` resolution.

```text
folio-reference-stack/
├── packages/
│   ├── core/                  # Clinical MDX parser, <ref> extractor, SD-JWT signer/verifier, did:web
│   ├── compiler-agent/        # AI Compiler + Cross-Modal Semantic Oracle verifier + mapper cache
│   ├── pop-engine/            # Union-then-Intersect Funnel: (DuckDB SQL ∪ ripgrep) + WASM + LLM tail
│   ├── a2a-protocol/          # Conversational Agent protocol, dynamic schema fulfillment & Inbox staging
│   └── blind-benchmark/       # Automated Eval Harness: measures Compile vs. Silent Semantic Error rates
├── apps/
│   ├── hospital-mercy/        # Node 1: Inpatient/Oncology EHR (Port 4001) + native Mercy .d.ts schemas
│   ├── clinic-valley/         # Node 2: Primary Care EHR (Port 4002) + native Valley .d.ts schemas
│   ├── ehi-adapter-demo/      # Bonus Bridge: Wraps real-world Epic-style EHI TSV tables + HTML docs into FOLIO
│   ├── trial-sponsor-a2a/     # Node 3: Interactive Clinical Trial & Payer A2A endpoint (Port 4003)
│   └── folio-workbench-ui/    # Unified Web UI (Port 3000): Patient Timeline, SD-JWT Inspector, Funnel & Eval Dashboard
└── data/
    ├── generator/             # Generates 250 synthetic patients with planted semantic traps & ECG blobs
    └── ablation-suites/       # 4 documentation quality tiers (Gold -> No JSDoc -> Cryptic Keys -> Broken Refs)
```

---

### 5.2 Step-by-Step Build Plan (Optimized for Frontier Coding Agents)

We will build the stack in **6 sequential phases**, starting immediately with the core format and the semantic compiler experiment so the hardest technical claims are tested on Day 1.

#### Phase 1: `packages/core` — Clinical MDX & SD-JWT Selective Disclosure
1. Build the **Clinical MDX parser/serializer** (`parseFolioItem`, `serializeFolioItem`) supporting YAML frontmatter, Markdown body with `<ref id="...">` AST extraction, and fenced `json:payload` blocks.
2. Implement **SD-JWT signing and selective disclosure**:
   * Given a FOLIO item and an institutional `did:web` private key, package each `<ref id="k">` narrative span + JSON entry as an independent SD-JWT disclosure.
   * Implement `createPresentation(item, disclosedRefIds[])` so a client can redact sensitive spans (like `psych_1`) and verify that the recipient can still validate the institutional signature over the remaining spans with zero canonicalization issues.
3. **Verification Test:** `bun test packages/core` verifies round-trip parsing, partial disclosure of `dx_1` + `med_1` while hiding `psych_1`, and tamper detection.

#### Phase 2: `data/generator` & `ablation-suites` — Synthetic Corpus with Planted Semantic Traps
To rigorously test whether compiler agents fall into clinical traps, the generator creates **250 patients** across two completely distinct institutional schemas (**Mercy Oncology** and **Valley Primary Care**) plus an **Epic-style EHI TSV table set**, specifically planting **5 classic clinical semantic traps**:
1. **The Status Trap:** Medication rows where `status_code: 2` means *Held/Discontinued* in Mercy’s schema, alongside active meds.
2. **The Unit Shift Trap:** Lab results mixing `platelets` in $10^3/\mu\text{L}$ (`140`) vs. raw cells/$\mu\text{L}$ (`140000`).
3. **The Superseded Lab Trap:** Hemolyzed potassium labs (`K: 6.8`) superseded 20 minutes later by a repeat draw (`K: 4.1`, `supersedes: ["rec_..."]`).
4. **The Negation / Rule-Out Trap:** Notes and assessment rows recording *"Ruled out pulmonary embolism"*.
5. **The Prose-Only Fact Trap:** 15 patients whose EGFR mutation or drug progression reason is recorded *only* in the Markdown narrative of an external transfer note, not in the structured table columns.

In addition, generate **4 Documentation Ablation Tiers** of the exact same data (`Tier 0: Rich .d.ts + JSDoc`, `Tier 1: Types only, no JSDoc`, `Tier 2: Obfuscated column names c1, c2`, `Tier 3: Obfuscated + no narrative <ref> links`).

#### Phase 3: `packages/compiler-agent` & `packages/blind-benchmark` — The Core Experiment
1. Build the **Compiler Agent Loop**:
   * Input: Source `.d.ts` schema + 3 sample records $\rightarrow$ Output: Deterministic TypeScript mapper to target views (`UnifiedMedication`, `UnifiedLab`, `UnifiedCondition`).
2. Build the **Cross-Modal Semantic Oracle**:
   * Automatically runs the compiled mapper on 10 sample items and compares its output against an independent LLM reading *only* the `<ref>` Markdown narrative spans. Measure how many semantic bugs the Oracle catches and auto-fixes!
3. Run the **Blind Agent Benchmark across Tiers 0–3**:
   * Output a real, measured confusion matrix showing **Compile Rate** vs. **Silent Semantic Error Rate** across the 5 planted clinical traps as documentation degrades from Tier 0 to Tier 3.

#### Phase 4: `packages/pop-engine` — The Union-Then-Intersect Population Funnel
1. Implement Stage 1: Given a natural-language cohort query, the agent inspects Mercy and Valley `.d.ts` catalogs and emits per-criterion DuckDB SQL queries *and* `ripgrep` regex patterns, computing $\text{Bitmap}(C_i) = \text{SQL}(C_i) \cup \text{Ripgrep}(C_i)$.
2. Implement Stage 2: Intersect bitmaps across criteria ($\bigcap_i \text{Bitmap}(C_i)$) and run a compiled **WASM filter** over synthetic binary ECG waveforms (detecting simulated prolonged QTc / arrhythmia on the surviving candidates).
3. Implement Stage 3: Parallel LLM verification over the surviving charts, outputting a structured eligibility table with clickable `(rec_id, ref_id)` provenance.
4. **Verification Test:** Prove that the 15 "Prose-Only Fact" patients are successfully recovered by the $\text{SQL} \cup \text{Ripgrep}$ union (whereas a naive SQL-first funnel drops them).

#### Phase 5: `packages/a2a-protocol` — Conversational Interop & Write-Back
1. Implement the **A2A Interactive Server & Client**:
   * **Scenario 1 (Clinical Trial Pre-Screening & Referral):** `hospital-mercy`’s agent submits a candidate patient to `trial-sponsor-a2a` using a published `TrialIntake.d.ts` contract + selectively disclosed SD-JWT proofs (`psych_1` redacted). The Trial Agent identifies a missing washout-date detail, converses with the patient’s Personal Agent to resolve it, and books the intake.
   * **Scenario 2 (Write-Back Staging):** The Patient Agent submits home blood pressure logs + symptom notes (`PersonalVitals.d.ts`) to `clinic-valley`, where Valley’s compiler agent maps and stages them for 1-click clinician sign-off.

#### Phase 6: `apps/folio-workbench-ui` — The Interactive Demonstration UI
Build a clean, single-page developer & clinician workbench (Vite + React + Tailwind) with four interactive tabs that tell the entire story visually:
1. **Tab 1: Unified Chart & SD-JWT Inspector:** View Jane Doe’s merged Mercy + Valley chart. Hover over any structured med or lab to highlight the exact `<ref>` prose span in the doctor's note. Toggle checkboxes to selectively redact `psych_1` and watch the live SD-JWT cryptographic verifier confirm Mercy’s signature on the remaining spans.
2. **Tab 2: The Compiler Loop & Semantic Oracle:** Inspect Mercy and Valley’s raw `.d.ts` schemas alongside the AI-compiled TypeScript mapper code, execution latency (<0.05ms/record), and the Semantic Oracle cross-check log.
3. **Tab 3: Population Funnel Explorer:** Type a clinical trial query, watch the live `SQL ∪ Ripgrep` union bitmaps, WASM waveform scan, and Stage 3 LLM verification table populate with citations.
4. **Tab 4: Live A2A Negotiation & Blind Benchmark Scorecard:** Watch two agents negotiate a referral/trial-screening gap in real time, and view the measured empirical curves from the Tier 0–3 Blind Agent Benchmark.

---

### Summary of What This Achieves
This v2 blueprint keeps the full, ambitious vision of a post-FHIR, Software 3.0 interoperability ecosystem while making every piece technically rigorous:
* It honors **CDA, FHIR, and Cures Act EHI Export** as the direct evolutionary precursors.
* It uses **SD-JWT (RFC 9901)** over `<ref>` spans to get portable institutional signatures and granular selective disclosure with **zero canonicalization headache**.
* It solves **"Who checks the mappers?"** by using the paired Markdown narrative as a Cross-Modal Semantic Oracle against silent clinical logic bugs.
* It fixes population discovery via a **recall-preserving $(\text{SQL} \cup \text{Ripgrep})$ union-then-intersect funnel**.
* It places **Conversational A2A Interoperability** at the center of dynamic clinical coordination, and backs the entire claim with an empirical **Blind Agent Benchmark** designed to test and catch silent semantic errors on Day 1.