---
folio: "0.1"
id: "01GSWVJTM09F0T05RNNC1VF0C6"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00773529"
effective: "2023-02-22T13:55:00Z"
recorded: "2023-02-22T15:24:00Z"
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

**Interval.** Overnight course was uneventful. She feels much better, is less short of breath and is tolerating liquids. Allergy: lisinopril (cough).

**Exam.** Vitals at 07:35: BP 131/79, HR 92, RR 17, T 98 F, SpO2 98%. Comfortable, breathing easily, mucous membranes moist.

**Results.** <ref id="bmp">The 06:02 panel: sodium 133 (L), potassium 4.4, chloride 102, bicarbonate 21 (L), anion gap 10, urea nitrogen 26 (H), creatinine 1.32 (H), eGFR 45 (L), glucose 123 (H).</ref>

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>: the anion gap has closed, from 24 on arrival to 10. Started <ref id="sc_glargine">insulin glargine 18 units subcutaneously daily at 07:00</ref>; the <ref id="iv_insulin">insulin infusion is being stopped at 09:00</ref> after the glargine overlap.
2. Medications: metformin, empagliflozin and losartan remain held. Continue amlodipine 5 mg daily.
3. Kidney function is stable, creatinine 1.32. Recheck tomorrow morning.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6412994",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-02-21T20:41:00Z",
    "admitted": "2023-02-21T23:42:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-02-22T13:35:00Z",
    "bp": { "systolic_mmhg": 131, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 92,
    "resp_rate_per_min": 17,
    "temp_f": 98,
    "spo2_pct": 98,
    "weight_kg": 62.7
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
    "accession": "L23053-2088",
    "collected": "2023-02-22T12:02:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "133",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.32",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "45",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "123",
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
    "started": "2023-02-21T21:51:00Z",
    "stopped": "2023-02-22T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2023-02-22T13:00:00Z"
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
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
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
