---
folio: "0.1"
id: "01HQEM99A06T31XA36XEEHV2EN"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00228871"
effective: "2024-02-23T00:14:00Z"
effective_end: "2024-02-24T19:00:00Z"
recorded: "2024-02-24T22:38:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>.

**Hospital course.** The patient was admitted with a wide gap acidosis and a near-normal glucose. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. Treatment was an insulin infusion per DKA protocol with dextrose-containing fluids, then a transition to basal insulin with endocrinology input. Symptoms resolved and the patient is eating normally.

**Condition at discharge.** Vitals at 10:00: BP 119/71, HR 79, RR 16, T 98.8 F, SpO2 97%. The final panel at 06:26 on 2/24 showed sodium 132, potassium 4.4, chloride 102, bicarbonate 23, anion gap 7, urea nitrogen 23, creatinine 0.95, eGFR 73, glucose 137. The gap has closed. Sodium of 132 is improved from admission and should be rechecked.

**Allergies:** no known drug allergies.

**Medications at discharge**

- <ref id="med_empagliflozin">Empagliflozin 10 mg daily: do not resume until reviewed by the primary care physician</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- Glipizide 5 mg daily: continue
- Levothyroxine 75 mcg daily: continue

**Follow-up.** See primary care (Northgate Family Medicine) within 1 week to decide whether to restart empagliflozin and to recheck a basic metabolic panel. Return to the ED for vomiting, abdominal pain, fast or deep breathing or marked fatigue.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6563461",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-02-22T19:48:00Z",
    "admitted": "2024-02-23T00:14:00Z",
    "discharged": "2024-02-24T19:00:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-02-24T16:00:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 16,
    "temp_f": 98.8,
    "spo2_pct": 97,
    "weight_kg": 86.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24055-9916",
    "collected": "2024-02-24T12:26:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "132",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "7", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "23", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.95",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "73",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "137",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "continue"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Decide whether to restart empagliflozin; recheck basic metabolic panel"
  }
}
```
