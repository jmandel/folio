---
folio: "0.1"
id: "01JAZC4NF00NX5XK1N7QCHK27D"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00224762"
effective: "2024-10-24T12:38:00Z"
recorded: "2024-10-24T13:41:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note, hospital day 3

**Interval.** He had a better night, with less coughing, and he ate most of his breakfast. The IV fluids were stopped last evening at 21:02.

**Exam.** Vitals at 07:18: BP 124/74, HR 108, RR 21, T 98.9 F, SpO2 97%. He looks comfortable. Crackles at the right base are less prominent. Heart is regular but fast.

**Results.** The <ref id="bmp">06:23 panel showed sodium 139, potassium 3.9, chloride 104, bicarbonate 24, anion gap 11, urea nitrogen 22, creatinine 1.63 (high), eGFR 39 (low) and glucose 145 (high)</ref>. The sodium has normalized and the creatinine continues to come down off the fluids.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, improving. Respiratory rate is a little higher than yesterday, so we will keep watching it today along with his oxygen saturation.
2. Kidney function is improving without IV fluids; recheck the panel in the morning.
3. Diabetes: metformin and empagliflozin remain held while kidney function recovers. Insulin glargine continues.
4. Losartan, chlorthalidone, atorvastatin and levothyroxine continue.
5. Lisinopril allergy (angioedema) is noted.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6382106",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-10-22T20:34:00Z",
    "admitted": "2024-10-23T02:02:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-10-24T12:18:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 108,
    "resp_rate_per_min": 21,
    "temp_f": 98.9,
    "spo2_pct": 97,
    "weight_kg": 69.9
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
    "accession": "L24298-8594",
    "collected": "2024-10-24T11:23:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.63",
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
        "value": "145",
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
    "started": "2024-10-22T21:24:00Z",
    "stopped": "2024-10-24T02:02:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "angioedema",
    "severity": "severe"
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
