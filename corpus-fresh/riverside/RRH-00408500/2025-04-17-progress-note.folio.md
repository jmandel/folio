---
folio: "0.1"
id: "01JS20E8600WEXMYRE8XSS477B"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00408500"
effective: "2025-04-17T12:30:00Z"
recorded: "2025-04-17T13:54:00Z"
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

**Interval.** The patient feels better, with less cough and improved energy. Eating normally. The IV fluids were stopped last night at 21:20.

**Exam.** Vitals at 07:10: BP 125/75, HR 89, RR 18, T 98.4 F, SpO2 99%. Breathing comfortably, speaking easily. Lung sounds are clearer, with a few crackles remaining at the base. Heart regular.

**Results.** <ref id="bmp">The 06:12 panel showed sodium 134, potassium 3.9, chloride 102, bicarbonate 21, anion gap 11, urea nitrogen 17, creatinine 1.54, eGFR 43, glucose 146</ref>. Creatinine continues to come down off fluids.

**Assessment and plan**

1. <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, improving. Respiratory rate and saturation are better today. Continue current treatment and watch for continued improvement.
2. Kidney function: improving; repeat the panel tomorrow now that fluids are off.
3. Diabetes: metformin and empagliflozin remain held for now. Continue insulin glargine 10 units nightly.
4. Continue lisinopril 40 mg daily and rosuvastatin 20 mg nightly.
5. Encourage walking in the hallway and oral fluids.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6426033",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-04-15T21:48:00Z",
    "admitted": "2025-04-16T02:20:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-04-17T12:10:00Z",
    "bp": { "systolic_mmhg": 125, "diastolic_mmhg": 75 },
    "heart_rate_bpm": 89,
    "resp_rate_per_min": 18,
    "temp_f": 98.4,
    "spo2_pct": 99,
    "weight_kg": 95.1
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
    "accession": "L25107-1076",
    "collected": "2025-04-17T11:12:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "17", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.54",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "43",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "146",
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
    "started": "2025-04-15T22:38:00Z",
    "stopped": "2025-04-17T02:20:00Z"
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 50 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
