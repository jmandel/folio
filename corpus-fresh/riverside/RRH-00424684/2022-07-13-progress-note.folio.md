---
folio: "0.1"
id: "01G7VWHJ901W22XP43Z4SV3V1D"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00424684"
effective: "2022-07-13T12:52:00Z"
recorded: "2022-07-13T13:39:00Z"
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

**Interval.** Seen at 07:52 on hospital day 5. Saline was stopped on 7/11 at 01:46 and has not been restarted. Allergy list remains NKDA.

**Exam.** Vitals at 07:32: BP 116/70, HR 94, RR 19, T 98.7 F, SpO2 98%. The patient is comfortable and conversing easily.

**Results.** The 06:19 panel: <ref id="bmp">sodium 139, potassium 3.9, chloride 103, bicarbonate 24, anion gap 12, urea nitrogen 28 (H), creatinine 1.32 (H), eGFR 63, glucose 154 (H)</ref>. Creatinine is nearly back to normal and eGFR is no longer flagged.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, active, improving clinically. Continue current treatment.
2. Metformin remains held. Glipizide, losartan and rosuvastatin continue.
3. Repeat the panel in the morning.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6541337",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2022-07-10T00:34:00Z",
    "admitted": "2022-07-10T06:46:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2022-07-13T12:32:00Z",
    "bp": { "systolic_mmhg": 116, "diastolic_mmhg": 70 },
    "heart_rate_bpm": 94,
    "resp_rate_per_min": 19,
    "temp_f": 98.7,
    "spo2_pct": 98,
    "weight_kg": 92.7
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
    "accession": "L22194-7391",
    "collected": "2022-07-13T11:19:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "12", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "28",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.32",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "63",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "154",
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
    "started": "2022-07-10T01:24:00Z",
    "stopped": "2022-07-11T06:46:00Z"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
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
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
