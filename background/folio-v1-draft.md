Here is the complete, unified document: **Manifesto, Technical RFC, Concrete End-to-End Walkthrough, The Blind Agent Benchmark, and the Reference Implementation Blueprint.**

---

# FOLIO: Federated Open Longitudinal Information Objects
## A Manifesto & Technical Blueprint for Healthcare Interoperability in the Era of Software 3.0

---

## Part 1: The Manifesto — Moving from Early Binding to Late Binding

### 1. Standing on the Shoulders of Giants
Over the past twenty-five years, healthcare interoperability has taken two great leaps forward:
* **HL7 CDA (and C-CDA)** established a vital foundational truth: a clinical artifact must bind human-readable, legally attestable narrative (`<text>`) to machine-readable structure (`<entry>`).
* **HL7 FHIR (and SMART)** brought healthcare onto the modern web—replacing opaque enterprise messaging with RESTful APIs, JSON, OAuth2, portable verifiable credentials (`did:web` / SMART Health Cards), and asynchronous bulk data exports (Flat FHIR).

FHIR succeeded because it met the software engineering reality of 2011. In 2011, **compute was semantically blind, so data had to be exhaustively pre-structured.** Because receiving software had zero intuition, every clinical concept, workflow state, and local nuance had to be negotiated in advance by a standards committee, constrained into an Implementation Guide, and mapped by every hospital into a single global schema (*Early Binding*).

### 2. The Paradigm Shift: Compute is Now Semantically Fluent
Today, the fundamental constraint of 2011 has inverted. Frontier AI models and coding agents can read a local database schema and write a deterministic, unit-tested parser in milliseconds. They can synthesize longitudinal clinical truth from clinical prose alongside local flowsheet structures with high accuracy.

In this new reality, **forcing the entire healthcare ecosystem through a single, pre-balloted global schema is no longer the enabler of interoperability—it is the bottleneck.** 
* Early-binding ETL forces institutions to strip local clinical nuance to fit rigid profiles, divorcing structured facts (`Observation`, `Condition`) from the clinical narrative (`DocumentReference`) that explains *why* they exist.
* Meanwhile, real-world precision medicine, clinical trial matching, and care coordination constantly require granular data points that no committee has yet profiled.

### 3. The Five Core Principles of FOLIO

1. **Put AI in the *Compiler* Loop, Not the *Runtime* Loop (Safe Late Binding):**
   We do not want LLMs hallucinating clinical translations on every read. Instead, systems export their native data structures alongside clean, self-describing TypeScript definitions (`.d.ts` with rich semantic docstrings). Receiving systems use AI agents *once per schema version* to generate, test, and cache deterministic transformation code and SQL queries.
2. **Fulfill CDA’s Promise—Unify the Narrative and the Data:**
   Heal the split between clinical notes and structured resources. Every **Record Item** binds human-readable Markdown narrative directly to native structured JSON payloads via inline span references (`<ref id="...">`). You never lose the prose context, and you never lose the machine structure.
3. **Sync-First, Grep-First Ergonomics:**
   Instead of requiring transactional EHR servers to implement complex graph query languages, standardize a dead-simple **append-only synchronization primitive**. Let single-patient apps and population data lakes use blazing-fast, standard tools (`ripgrep`, DuckDB/SQL, WASM UDFs, and LLMs) over synced records.
4. **Portable Trust via Web-Native Cryptography (`did:web` + JWS):**
   Data must retain its provenance when routed through a patient's Personal Agent or across research networks. Every Record Item is signed using standard JSON Web Signatures (JWS) tied to lightweight `did:web` HTTPS key discovery—no blockchains, no complex RDF canonicalization.
5. **Conversational Workflows Over Rigid State Machines:**
   For dynamic, cross-organizational workflows (Prior Auth, referrals, scheduling, order staging), replace brittle, pre-balloted state machines with an **Agent-to-Agent (A2A) Protocol** where endpoints converse in natural language and dynamically negotiate ephemeral TypeScript schemas to conclude transactions.

---

## Part 2: Concrete Walkthrough — How FOLIO Works in the Wild

Before specifying the formal architecture, let’s trace a single piece of clinical data across three real-world scenarios: **Authoring & Sync**, **Population Cohort Discovery**, and **Conversational Prior Authorization**.

### Scenario A: Authoring & Single-Patient Sync
Dr. Alice Smith at **Mercy Oncology** sees patient **Jane Doe** (`pat_99812`) for non-small cell lung cancer (NSCLC). Instead of shattering this encounter into 15 separate resources across 6 endpoints, Mercy emits a single, signed **FOLIO Record Item**:

```markdown
---
id: "rec_01J8Z9X2A"
patient: "pat_99812"
effective_time: "2026-03-15T14:22:00Z"
recorded_time: "2026-03-15T14:25:10Z"
issuer: "did:web:mercy.org"
author: "did:web:mercy.org:staff:dr-smith"
kind: "note"
supersedes: null
schema_uri: "https://mercy.org/schemas/onc_visit_v3.d.ts#sha256=4a8b9c..."
jws: "eyJhbGciOiJFZERTQSIsImtpZCI6Im1lcmN5LWtleS0xIn0..8f9a2b..."
---
### Oncology Follow-Up
Jane returns for restaging of her <ref id="dx_1">Stage IV EGFR Exon 19 del NSCLC</ref>. 
Unfortunately, <ref id="img_1">CT chest today shows a new 1.8cm RLL nodule</ref>, representing 
disease progression after 14 months on <ref id="med_1">osimertinib 80mg daily</ref>. 
Her <ref id="perf_1">ECOG performance status remains 1</ref> (ambulatory, light housework). 
We discussed clinical trial options vs. platinum doublet chemotherapy.

```json:payload
{
  "dx_1": {
    "local_code": "ONC-4412",
    "icd10": "C34.90",
    "histology": "Adenocarcinoma",
    "biomarkers": [{ "gene": "EGFR", "variant": "Exon 19 deletion", "status": "positive" }]
  },
  "img_1": {
    "impression": "Progressive disease (RECIST 1.1)",
    "dicom_manifest_url": "https://mercy.org/blobs/dicom/study_88219.json"
  },
  "med_1": {
    "drug_name": "osimertinib",
    "rxnorm": "1726061",
    "dose": "80 mg",
    "status": "discontinued",
    "stop_reason": "progression"
  },
  "perf_1": { "scale": "ECOG", "score": 1 }
}
```
```

And what lives at `https://mercy.org/schemas/onc_visit_v3.d.ts`? Mercy’s native, self-describing TypeScript definition:

```typescript
/** Mercy Cancer Center — Outpatient Visit Extraction Schema (v3) */
export interface MercyOncVisitPayload {
  [ref_id: string]: OncDiagnosis | OncImagingSummary | OncMedication | PerformanceStatus;
}

export interface OncMedication {
  drug_name: string;
  rxnorm?: string;
  dose: string;
  status: 'active' | 'held' | 'discontinued';
  /** Reason for holding or stopping therapy, captured in MercyOnc flowsheet */
  stop_reason?: 'toxicity' | 'progression' | 'patient_preference' | 'completed' | string;
}
// ... (remaining clean TypeScript interfaces)
```

**What happens when Jane’s Personal Health Agent syncs this?**
Jane’s phone calls `GET /patients/pat_99812/sync?since=cursor_88`. It downloads this 2KB item, verifies the `did:web:mercy.org` JWS signature offline, and appends it to her local SQLite/file log. Both the human-readable prose and the exact structured fields are intact and linked.

---

### Scenario B: Population Query (The 3-Stage Funnel)
A clinical trial sponsor wants to find all patients at Mercy (out of 2 million patients) matching:
> *"EGFR Exon 19 deletion NSCLC, progressed specifically on osimertinib (not stopped due to toxicity), ECOG 0–1, and Platelets > 100,000 in the last 30 days."*

No upfront OMOP or FHIR profiling was done for `stop_reason: 'progression'` or `EGFR Exon 19`. Yet Mercy’s **Population Query Agent** resolves this across 2 million patients in **under 8 seconds** using the **3-Stage Funnel**:

1. **Stage 1 — Schema-Compiled SQL (2,000,000 $\rightarrow$ 180 patients in 1.2s):**
   The agent inspects Mercy’s catalog of ~80 local `.d.ts` schemas. It sees `MercyOncVisitPayload` and `MercyCoreLabPayload`, and compiles a deterministic DuckDB SQL query over Mercy’s Parquet mirror:
   *Filter where `icd10 LIKE 'C34%'`, `med.drug_name ILIKE '%osimertinib%'`, and join `MercyCoreLabPayload` where `platelets > 100` within 30 days.*
2. **Stage 2 — Lexical Trigram Index / `ripgrep` (180 $\rightarrow$ 42 patients in 0.1s):**
   For clinics within Mercy whose notes weren't captured in the structured oncology flowsheet, the agent runs a blazing-fast regex/trigram filter (`(?i)exon 19.*osimertinib|ecog\s*[01]`) over the markdown narratives of the candidate pool.
3. **Stage 3 — Last-Mile Agentic Verification (42 $\rightarrow$ 31 verified patients in 5.5s):**
   Parallel LLM workers read the longitudinal markdown+JSON slices of the 42 survivors. They verify that osimertinib was stopped for *progression* (excluding 11 patients who stopped for pneumonitis/toxicity) and output a deterministic cohort table where every cell is pinned to a verified `(rec_id, ref_id)` citation.

---

### Scenario C: Conversational Interop (A2A Workflow)
Dr. Smith decides to prescribe a novel second-line therapy (**Amivantamab**) requiring Prior Authorization from **Apex Payer**.
1. **Handshake:** Mercy’s Clinic Agent opens an A2A session with `https://payer.apex.com/a2a`, presenting an OAuth token and capability manifest.
2. **Dynamic Schema Negotiation:** Instead of requiring a rigid HL7 Da Vinci profile, Apex’s Payer Agent replies:
   *"To adjudicate Amivantamab for NSCLC, please populate the following TypeScript interface and attach signed FOLIO Record Item proofs for each requirement:"*
   ```typescript
   interface AmivantamabPriorAuth {
     patient_dob: string;
     egfr_variant_confirmed: boolean;
     evidence_record_id_egfr: string; // Must reference signed lab/onc note
     prior_osimertinib_progression: boolean;
     evidence_record_id_progression: string;
     current_ecog: 0 | 1 | 2 | 3 | 4;
   }
   ```
3. **Execution & Cryptographic Proof:** Mercy’s Clinic Agent queries Jane’s synced log, fills out the exact JSON object, attaches `rec_01J8Z9X2A` (signed by `did:web:mercy.org`), and submits it. Apex’s Payer Agent verifies Mercy’s JWS signature, checks the `<ref>` spans in the attached record, and returns a signed Approval Record Item that gets appended directly back into Jane’s chart.

---

## Part 3: The Technical Specification (RFC Summary)

### 3.1 The Universal Envelope Specification
Every FOLIO Record Item is serialized either as **Clinical MDX** (YAML Frontmatter + Markdown + fenced `json:payload` block, ideal for LLM reading and `ripgrep`) or as an isomorphic **JSON Envelope** (for NDJSON streaming and Parquet columnar mapping):

| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` (ULID) | Globally unique, lexicographically sortable identifier (`rec_01J8...`). |
| `patient` | `string` | Local or federated patient identifier. |
| `effective_time` | `ISO8601` | Clinically relevant timestamp (when the lab was drawn or visit occurred). |
| `recorded_time` | `ISO8601` | System timestamp when this immutable item was committed. |
| `issuer` | `did:web` URI | Organization issuing and signing the item (e.g., `did:web:mercy.org`). |
| `author` | `did:web` / URI | Specific clinician, device, or patient agent that authored the item. |
| `kind` | `Enum` | Coarse routing bucket: `note` \| `lab` \| `vital` \| `med` \| `imaging` \| `procedure` \| `admin` \| `device` \| `state_summary`. |
| `supersedes` | `string[] \| null` | Array of prior `rec_id`s that this item amends or replaces. |
| `retracted` | `boolean` | If `true`, marks the superseded item(s) as entered-in-error. |
| `schema_uri` | `HTTPS URI + Hash` | URL to the TypeScript `.d.ts` file, pinned by `#sha256=...` content hash. |
| `jws` | `string` | Detached JWS signature (Ed25519 / ES256) over the canonical JSON representation of the item. |

### 3.2 Binary & Waveform Offloading (WASM Pushdown)
FOLIO logs never embed heavy binaries (DICOM pixels, 500Hz ICU telemetry waveforms, BAM/VCF genomics). Instead, the Record Item contains the human interpretation + metadata and a URL pointer to a standard columnar/chunked blob (e.g., Parquet, Zarr, or DICOMweb).
* **Waveform/Binary Population Queries:** When a population query asks *"Find all ICU patients with T-wave alternans or a specific arterial line waveform morphology,"* the Stage 1 Query Engine accepts a sandboxed **WebAssembly (WASM) filter module** (`(blob: Uint8Array) => Score`) compiled by the querying agent, executing it at native speed across the referenced binary blobs.

### 3.3 Compaction & State Projections (`state_summary`)
Because the log is append-only:
* **Compaction Rule:** Any reader syncing a log automatically hides any `rec_id` referenced in a later valid item’s `supersedes` array (unless auditing history).
* **Fast Chart Open:** To allow a clinician UI to render an instant "Current Active Meds & Problems" view in <100ms without re-computing the entire log on every open, an institution’s agent (or the patient’s Personal Agent) periodically commits a signed `kind: "state_summary"` Record Item—which asserts the current reconciled list, with every entry holding a `<ref>` array pointing to the historical `rec_id`s that justify it.

---

## Part 4: The "Blind Agent Benchmark" (Defeating Malicious Compliance)

A standard that permits local schemas faces an obvious regulatory threat: **What stops an EHR vendor from exporting obfuscated, undocumented tables (`{"c_01": "881", "flag_x": 2}`) with empty narrative blocks and claiming compliance?**

In FHIR, certification (e.g., ONC Inferno) tests **Syntactic Conformance** (does the JSON validate against a profile?). Vendors can pass syntactic validation while omitting 70% of clinical context.

FOLIO replaces syntactic validation with an **Information-Theoretic Parity Test**:

### 4.1 The Two Regulatory Rules
1. **UI-to-Stream Parity:** Any clinical data element, flowsheet row, comment, or document visible to an authenticated clinician inside the EHR's native UI *must* be exported in the FOLIO Record Item stream.
2. **Zero-Shot Agentic Readability:** The vendor’s exported `.d.ts` schemas and Record Items must be clear enough that a standardized, open-weights **Reference Benchmark Agent**—operating inside an air-gapped test harness with **zero vendor-specific training or human intervention**—can deterministically query and extract clinical truth from the export.

### 4.2 How the Automated Certification Harness Works
1. **The Synthetic Gold Cohort:** The regulator generates 100 complex synthetic patients (with nuanced oncology histories, amended labs, discontinued meds, flowsheet comments, and radiology reports) and loads them into the vendor’s EHR (via UI automation or native ingestion).
2. **The Export:** The vendor exports the 100 patients as a FOLIO repository (Record Items + local `.d.ts` schema files).
3. **The Blind Agent Evaluation:** The isolated Reference Agent is given *only* the exported directory and a suite of **200 Clinical & Analytical Challenges**:
   * *Task Type A (Schema-to-SQL Compilation):* "Write a DuckDB SQL query against the vendor's exported schemas to return all patients whose systolic BP dropped >30 mmHg within 4 hours of an IV antihypertensive." (Executed deterministically; must achieve 100% precision/recall against the gold truth).
   * *Task Type B (Longitudinal Fact & Provenance Extraction):* "Why did Patient #42 stop taking lisinopril, and who documented it?" (Agent must return both the correct answer and the exact `rec_id` + `<ref>` span).
   * *Task Type C (Round-Trip Assimilation):* The harness generates a new Record Item using a novel external clinic schema and submits it to the vendor’s Write-Back Staging API. The vendor’s ingestion agent must accurately stage the structured items for clinician sign-off.
4. **Scoring:** If the vendor exported cryptic column names (`col_99`) without accurate TypeScript docstrings, or stripped narrative links, the Blind Agent’s compiled SQL queries will fail, and the vendor **automatically fails certification**. Honest vendors do *less* work (just export native structures with clear TypeScript definitions!); malicious compliance becomes mathematically impossible to hide.

---

## Part 5: Master Implementation Plan — Building the Reference Stack

To prove this architecture isn't vaporware, we can build a complete, end-to-end **FOLIO Reference Stack** using modern TypeScript, **Bun**, **DuckDB**, **ripgrep**, and **Frontier Coding/Runtime Agents** (via Claude Code / Gemini CLI / Codex CLI and MCP/A2A harnesses).

### 5.1 The Narrative Arc of the Reference Demo
We will build a mono-repo that simulates a live, multi-institution healthcare ecosystem for **500 synthetic patients** (including 5 deep "hero" longitudinal charts), telling a 4-act story:
* **Act I (Two Hospitals, Zero Shared Schemas):** **Mercy General** (an Epic-like inpatient/oncology system) and **Valley Clinic** (a community primary care EHR) each export native, completely different `.d.ts` schemas and Clinical MDX logs.
* **Act II (The Patient & Clinician Experience):** A patient’s **Personal Health Agent** syncs records from both hospitals, verifies `did:web` signatures, and compiles instant TypeScript mappers on the fly to render a unified timeline with hover-to-audit `<ref>` provenance.
* **Act III (The 3-Stage Population Funnel):** A **Clinical Trial Matcher** runs a complex oncology + waveform query across all 500 patients (compiling SQL across Mercy and Valley schemas, running `ripgrep` over notes, executing a WASM filter over synthetic ECG waveforms, and running parallel LLM verification on the final candidates).
* **Act IV (Conversational A2A + The Blind Agent Benchmark):** Mercy’s agent negotiates a live Prior Auth with **Apex Payer’s Agent** via dynamic TypeScript schema exchange, and finally, we run the **Blind Agent Certification Suite** against both hospitals—watching it pass clean schemas and catch a "Maliciously Obfuscated Vendor" export.

---

### 5.2 Tech Stack & Repository Architecture

* **Runtime & Package Manager:** **Bun** (blazing fast TypeScript execution, built-in `bun:sqlite`, native HTTP servers, native file/process runners).
* **Analytical & Search Engine:** **DuckDB** (`@duckdb/node-api` over Parquet/NDJSON) + **`ripgrep` (`rg`)** spawned via `Bun.spawn` for sub-millisecond regex/lexical search.
* **Cryptography:** `jose` (for standard Ed25519 JWS signing/verification and `did:web` JWKS resolution).
* **AI / Agent Layer:** Frontier models invoked via a clean **Compiler & Agent Harness** (using structured outputs + a sandboxed Bun subprocess runner so the agent can write, typecheck, and execute `.ts` mappers and `.sql` queries in an isolated worker).

```text
folio-reference-stack/
├── packages/
│   ├── core/                  # Envelope types, Clinical MDX parser, JWS + did:web verifier
│   ├── sync-server/           # Reusable Bun HTTP server implementing FOLIO Sync + A2A endpoints
│   ├── compiler-agent/        # AI Compiler loop: reads .d.ts -> generates/tests .ts mappers & DuckDB SQL
│   ├── pop-engine/            # 3-Stage Funnel: DuckDB + ripgrep + WASM waveform runner + LLM tail verifier
│   ├── a2a-protocol/          # Conversational Agent handshake, dynamic schema negotiation & Inbox staging
│   └── blind-benchmark/       # Automated certification harness (Gold Truth vs. Blind Agent)
├── apps/
│   ├── hospital-mercy/        # Node 1: Inpatient/Oncology EHR (Port 4001) + native Mercy schemas
│   ├── clinic-valley/         # Node 2: Primary Care EHR (Port 4002) + native Valley schemas
│   ├── payer-apex/            # Node 3: Payer A2A server (Port 4003) for conversational Prior Auth
│   ├── patient-agent-ui/      # Next.js/Vite UI + Personal Agent (Port 3000): Unified chart + <ref> audit
│   └── trial-explorer-ui/     # Researcher UI (Port 3001): Live 3-stage funnel cohort builder
└── data/
    ├── generator/             # Synthetic population generator (500 patients + ECG binary blobs)
    └── malicious-vendor/      # Intentionally obfuscated export to demonstrate benchmark failure
```

---

### 5.3 Step-by-Step Build Plan (Designed for AI Coding Agents)

We can build this entire mono-repo systematically in **6 Modules**:

#### Module 1: `packages/core` — The Wire Format, MDX Parser, and `did:web` Crypto
* **What it does:**
  1. Parses and serializes **Clinical MDX** (extracting YAML frontmatter, Markdown body with `<ref id="...">` character offset indexing, and the fenced `json:payload` block).
  2. Implements a bidirectional converter between Clinical MDX files (`.folio.md`) and flat JSON/Parquet rows.
  3. Implements `signRecordItem(item, privateKey)` and `verifyRecordItem(item, didResolver)` using Ed25519 JWS and mock/local `/.well-known/did.json` resolution.
* **Deliverable Test:** `bun test packages/core` parses a multi-ref oncology note, verifies character offsets, signs it, mutates one character in the prose, and proves signature verification fails.

#### Module 2: `data/generator` — The 500-Patient Multi-Schema Synthetic Corpus
* **What it does:**
  1. Defines **Mercy General’s** local TypeScript schemas (`MercyOncVisit`, `MercyInpatientLabs`, `MercyFlowsheetVitals`, `MercyTelemetryStub`) and **Valley Clinic’s** completely different local schemas (`ValleySOAPNote`, `ValleyQuestLabs`, `ValleyMedList`).
  2. Generates 500 realistic patients (495 background patients via fast deterministic templates + 5 rich longitudinal "hero" patients generated via LLM with realistic clinical nuance, amendments via `supersedes`, and embedded `<ref>` tags).
  3. Generates synthetic binary 12-lead ECG waveform blobs (`.bin` / `.parquet`) for 50 patients (10 with synthetic atrial fibrillation / prolonged QT).
* **Deliverable Test:** Outputs a populated `data/` directory with 15,000 signed `.folio.md` items, Parquet mirrors, and `.d.ts` schema catalogs.

#### Module 3: `packages/compiler-agent` — AI in the Compiler Loop
* **What it does:**
  This is the secret sauce of FOLIO. When given an unknown `schema_uri` (e.g., `ValleyMedList.d.ts`) and a target view (e.g., the Patient UI's `UnifiedMedicationView.d.ts`), the **Compiler Agent**:
  1. Fetches the source `.d.ts` and 3 sample JSON payloads (with masked PHI or synthetic structure).
  2. Prompts the frontier model to write a pure, deterministic TypeScript function `export function transform(item: ValleyMedList): UnifiedMedicationView[]`.
  3. Runs `bun build` / TypeScript typechecking and executes unit assertions in a sandboxed worker.
  4. Caches the compiled function keyed by the `sha256` hash of the `.d.ts` file. Every subsequent read executes at native JS speed (0.01ms) with zero LLM calls!

#### Module 4: `packages/pop-engine` — The 3-Stage Population Query Funnel
* **What it does:**
  Takes a natural language clinical trial or quality query and executes the 3-stage pipeline:
  1. **Stage 1 (SQL + WASM Compiler):** Inspects all `.d.ts` files in the institution's catalog, writes a DuckDB SQL query over the Parquet store, and (if waveform criteria are present) compiles/selects a WASM waveform analyzer to run over referenced binary blobs.
  2. **Stage 2 (`ripgrep` Lexical Filter):** Spawns `rg --json` over the surviving patients' `.folio.md` narrative files using agent-generated regex patterns.
  3. **Stage 3 (Parallel Agentic Verifier):** Sends the surviving candidate records to parallel LLM calls with structured output schemas requiring `{ eligible: boolean, criteria_met: Record<string, { met: boolean, quote: string, rec_id: string, ref_id: string }> }`.
* **Deliverable Test:** CLI command `bun run query "Find NSCLC patients who progressed on osimertinib with ECOG <= 1 and normal QTc on ECG"` prints the live funnel metrics (`500 -> 24 -> 9 -> 6 patients in 3.8s`) with clickable provenance links.

#### Module 5: `packages/a2a-protocol` — Conversational Prior Auth & Write-Back Staging
* **What it does:**
  1. Implements the HTTP/SSE endpoint `/a2a/session` on `hospital-mercy`, `clinic-valley`, and `payer-apex`.
  2. Demonstrates **Dynamic Schema Negotiation**: `payer-apex` sends an ephemeral TypeScript interface for Amivantamab Prior Auth; `hospital-mercy`’s agent queries the patient’s FOLIO log, populates the schema, attaches the JWS-signed `rec_id` proofs, and receives a signed Approval Record Item.
  3. Demonstrates **Write-Back Staging**: The Patient Agent submits a home blood pressure log + symptom diary (in its own `PersonalAgentVitals.d.ts` schema) to `clinic-valley`'s `/inbox/submit` endpoint. Valley’s compiler agent maps it into staged EHR flowsheet rows for 1-click clinician acceptance.

#### Module 6: `packages/blind-benchmark` & The Interactive UIs
* **The UIs (`patient-agent-ui` & `trial-explorer-ui`):**
  * **Patient & Clinician Chart UI:** Shows a unified longitudinal timeline combining Mercy and Valley records. Clicking any structured medication or lab highlights the exact `<ref>` sentence in the original doctor's Markdown note and displays the green `did:web` signature verification badge.
  * **Trial Explorer UI:** Visualizes the 3-Stage Funnel in real time (showing the generated SQL, the `ripgrep` matches, the WASM ECG waveform overlay, and the final verified cohort table).
* **The Blind Benchmark Runner (`bun run benchmark`):**
  Runs the automated certification test against `hospital-mercy` (Score: **99.5% PASS**), `clinic-valley` (Score: **98.0% PASS**), and `data/malicious-vendor`—an export that uses cryptic column names (`c1`, `c2`) and omits docstrings (Score: **14.0% FAIL — Certification Denied**).

---

### Ready to Build?
This blueprint gives us both the **intellectual thesis** (why late-binding + compiler-in-the-loop + unified narrative/structure is the natural successor to FHIR) and a **concrete, runnable engineering plan** that demonstrates every piece of the architecture in TypeScript and Bun.