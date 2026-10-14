---
folio: "0.1"
id: "01JGEM4V40GQYKNP5C8QDPWP9J"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00046468"
effective: "2024-12-31T13:36:00Z"
recorded: "2024-12-31T15:08:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Progress note

- <ref id="dx_dka">diagnosis "Euglycemic DKA, SGLT2 inhibitor-associated", status active</ref>
- <ref id="bmp">Basic metabolic panel drawn 12/31 06:21 (local time): Sodium 132 mmol/L (L), Potassium 4.0 mmol/L, Chloride 101 mmol/L, Bicarbonate (total CO2) 22 mmol/L, Anion gap 9 mmol/L, Urea nitrogen 25 mg/dL (H), Creatinine 1.10 mg/dL (H), eGFR (CKD-EPI 2021) 56 mL/min/1.73m2 (L), Glucose 183 mg/dL (H)</ref>
- <ref id="sc_glargine">inpatient order insulin glargine SubQ 17 units daily, started 12/31 07:00, still running (local times)</ref>
- <ref id="iv_insulin">inpatient order insulin regular (human) IV infusion IV per DKA protocol, 0.1 units/kg/h, started 12/30 17:05, stopped 12/31 09:00 (local times)</ref>

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6162913",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-12-30T21:55:00Z",
    "admitted": "2024-12-31T01:17:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-12-31T13:16:00Z",
    "bp": { "systolic_mmhg": 112, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 78,
    "resp_rate_per_min": 22,
    "temp_f": 98.1,
    "spo2_pct": 98,
    "weight_kg": 103.1
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24366-3388",
    "collected": "2024-12-31T12:21:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "25",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.10",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "56",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "183",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2024-12-30T23:05:00Z",
    "stopped": "2024-12-31T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "17 units daily",
    "started": "2024-12-31T13:00:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held"
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
