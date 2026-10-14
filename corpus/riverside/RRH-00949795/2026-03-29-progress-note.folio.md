---
folio: "0.1"
id: "01KMWYZWW0XD039WWBAVP8F5HP"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00949795"
effective: "2026-03-29T12:42:00Z"
recorded: "2026-03-29T14:12:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** Feels stronger today, with a mild residual cough. Eating most of his meals. Allergies: NKDA.

**Exam.** Vitals at 07:22: BP 137/82, HR 93, RR 21, T 99 F, SpO2 97%. Comfortable at rest. Lungs with minimal crackles at the base. Heart regular.

**Results.** <ref id="bmp">The 06:22 panel showed sodium 136, potassium 3.9, chloride 101, bicarbonate 22, anion gap 13, urea nitrogen 15, creatinine 1.46 (H), eGFR 39 (L) and glucose 144 (H)</ref>. Sodium has returned to normal and the anion gap is back in range. Creatinine has improved steadily from 1.67 on arrival.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>: continuing to recover. Respiratory rate is a little high on this check and will be rechecked, but saturation is good.
2. Kidney function: improving with oral intake. Repeat panel tomorrow morning.
3. Metformin and empagliflozin remain held today.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6532872",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-03-26T22:55:00Z",
    "admitted": "2026-03-27T04:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-03-29T12:22:00Z",
    "bp": { "systolic_mmhg": 137, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 93,
    "resp_rate_per_min": 21,
    "temp_f": 99,
    "spo2_pct": 97,
    "weight_kg": 70.5
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26088-8762",
    "collected": "2026-03-29T11:22:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "15", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.46",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "39",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "144",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_ns": {
    "type": "inpatient_med",
    "drug_name": "sodium chloride 0.9%",
    "route": "IV",
    "dose_text": "75 mL/h",
    "started": "2026-03-26T23:45:00Z",
    "stopped": "2026-03-28T04:36:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 500 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "500 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
