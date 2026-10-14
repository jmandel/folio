---
folio: "0.1"
id: "01GA6HS8A0NG0H60K6SHZY2YZN"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00517408"
effective: "2022-08-11T12:42:00Z"
recorded: "2022-08-11T13:34:00Z"
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

**Interval.** The patient feels well and is eating. Cough is improving. Vitals at 07:22: BP 127/76, HR 82, RR 18, T 98 F, SpO2 99%. The saline infusion was stopped yesterday at 17:36.

**Exam.** Comfortable and breathing easily. Chest sounds clearer.

**Results.** <ref id="bmp">Basic metabolic panel at 06:24: sodium 134 (L), potassium 3.9, chloride 103, bicarbonate 23, anion gap 8, urea nitrogen 21, creatinine 1.56 (H), eGFR 49 (L), glucose 170 (H)</ref>.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, active and continuing to improve. Continue current treatment.
2. Creatinine continues to come down, 1.56 today from 1.66 yesterday, now off IV fluids. Sodium is 134 and will be rechecked tomorrow.
3. Losartan remains held.
4. Chlorthalidone and atorvastatin: continue.
5. No known drug allergies.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6944313",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-08-09T18:20:00Z",
    "admitted": "2022-08-09T22:36:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-08-11T12:22:00Z",
    "bp": { "systolic_mmhg": 127, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 82,
    "resp_rate_per_min": 18,
    "temp_f": 98,
    "spo2_pct": 99,
    "weight_kg": 86.9
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
    "accession": "L22223-6328",
    "collected": "2022-08-11T11:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "21", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.56",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "49",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "170",
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
    "started": "2022-08-09T19:10:00Z",
    "stopped": "2022-08-10T22:36:00Z"
  },
  "alg_nkda": {
    "type": "allergy",
    "substance": "NKDA",
    "severity": "unknown"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
