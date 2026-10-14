---
folio: "0.1"
id: "01JHQS8220GG9A0E04WCVT8WSS"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00152245"
effective: "2025-01-16T13:39:00Z"
recorded: "2025-01-16T14:46:00Z"
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

**Interval.** She feels better, with less diarrhea overnight, and is drinking. Allergy list: lisinopril (cough); dapagliflozin (diabetic ketoacidosis).

**Exam.** BP 114/68, HR 104, RR 20, T 98.9 F, SpO2 97% at 07:19. Mucous membranes are a little moist. Abdomen is soft.

**Results.** The <ref id="bmp">06:24 panel shows sodium 137, potassium 5.8, chloride 103, bicarbonate 21, anion gap 13, urea nitrogen 19, creatinine 2.01, eGFR 24 and glucose 125</ref>.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving: creatinine has fallen from 2.46 to 2.01 with fluids. Continue normal saline at 125 mL/h. Potassium is 5.8, still high but better than yesterday; repeat in the morning.
2. Metformin and losartan remain held.
3. Heart rate is still 104, which fits ongoing volume depletion; reassess after more fluid.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6565340",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-01-15T21:34:00Z",
    "admitted": "2025-01-16T01:55:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-01-16T13:19:00Z",
    "bp": { "systolic_mmhg": 114, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 20,
    "temp_f": 98.9,
    "spo2_pct": 97,
    "weight_kg": 98.4
  },
  "dx_aki": {
    "type": "diagnosis",
    "label": "Acute kidney injury",
    "icd10cm": "N17.9",
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25016-4127",
    "collected": "2025-01-16T12:24:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.8",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.01",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "24",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "125",
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
    "dose_text": "1000 mL bolus, then 125 mL/h",
    "started": "2025-01-15T22:24:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "alg_dapagliflozin": {
    "type": "allergy",
    "substance": "dapagliflozin",
    "rxnorm_ingredient": "1488564",
    "reaction": "diabetic ketoacidosis",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
