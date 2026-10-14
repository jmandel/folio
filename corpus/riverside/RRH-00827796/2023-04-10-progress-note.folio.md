---
folio: "0.1"
id: "01GXNQB4J030WACH6BEX9HZHMK"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00827796"
effective: "2023-04-10T12:35:00Z"
recorded: "2023-04-10T13:58:00Z"
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

**Interval history.** The patient reports less diarrhea and is drinking more. Saline was stopped at 03:49 this morning.

**Exam.** At 07:15: BP 124/74, HR 107, RR 24, T 98.8 F, SpO2 95%. The patient is comfortable at rest, mucous membranes are moist, and the abdomen is soft.

**Results.** <ref id="bmp">On the 06:11 panel: sodium 135 (L), potassium 6.1 (H), chloride 99, bicarbonate 25, anion gap 11, urea nitrogen 23, creatinine 2.47 (H), eGFR 29 (L), glucose 140 (H).</ref> Creatinine is down from 2.89 at admission, and potassium has come down from 6.8 but remains high.

**Assessment and plan**

1. <ref id="dx_aki">Acute kidney injury</ref>, improving with fluids. Repeat the panel in the morning.
2. Hyperkalemia, still elevated at 6.1. Continue to follow the potassium closely.
3. Losartan, hydrochlorothiazide and metformin remain held. Semaglutide continues.
4. Allergy: lisinopril (cough).

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6590130",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-04-09T03:55:00Z",
    "admitted": "2023-04-09T08:49:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-04-10T12:15:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 107,
    "resp_rate_per_min": 24,
    "temp_f": 98.8,
    "spo2_pct": 95,
    "weight_kg": 82.4
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
    "accession": "L23100-9041",
    "collected": "2023-04-10T11:11:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "6.1",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "25",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "23", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "2.47",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "29",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "140",
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
    "started": "2023-04-09T04:45:00Z",
    "stopped": "2023-04-10T08:49:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "cough",
    "severity": "mild"
  },
  "med_metformin": {
    "type": "home_med",
    "drug_name": "metformin 1000 mg tablet",
    "rxnorm_ingredient": "6809",
    "dose_text": "1000 mg",
    "sig": "1 tab PO BID with meals",
    "status": "held"
  },
  "med_semaglutide": {
    "type": "home_med",
    "drug_name": "semaglutide pen",
    "rxnorm_ingredient": "1991302",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
