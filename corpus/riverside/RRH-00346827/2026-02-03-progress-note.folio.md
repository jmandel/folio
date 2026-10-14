---
folio: "0.1"
id: "01KGHZRG1080Q9B242M9RP6N4M"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00346827"
effective: "2026-02-03T13:35:00Z"
recorded: "2026-02-03T14:51:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

**Interval.** The patient feels better this morning, with less cough and easier breathing. The IV saline was stopped at 00:26 on 2/3.

**Exam.** Vitals at 07:15: BP 124/74, HR 90, RR 21, T 98.5 F, SpO2 99%. The patient is sitting up and comfortable. Lungs have fewer crackles than on admission.

**Results.** <ref id="bmp">Basic metabolic panel on the 06:27 draw: sodium 135 (L), potassium 4.1, chloride 104, bicarbonate 24, anion gap 7, urea nitrogen 24 (H), creatinine 1.92 (H), eGFR 37 (L), glucose 113 (H)</ref>. Bicarbonate has normalized, and creatinine is down from 2.07 on admission.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, improving. Continue the current treatment and monitor the respiratory rate.
2. Kidney function is improving with fluids; creatinine remains above normal. Recheck the panel in the morning.
3. Metformin and empagliflozin remain held. Losartan and amlodipine continue.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6700193",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-02-02T00:34:00Z",
    "admitted": "2026-02-02T06:26:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-02-03T13:15:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 90,
    "resp_rate_per_min": 21,
    "temp_f": 98.5,
    "spo2_pct": 99,
    "weight_kg": 75.1
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
    "accession": "L26034-3105",
    "collected": "2026-02-03T12:27:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "135",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "7", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "24",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.92",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "37",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "113",
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
    "started": "2026-02-02T01:24:00Z",
    "stopped": "2026-02-03T06:26:00Z"
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
    "status": "held"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
