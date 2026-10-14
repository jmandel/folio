---
folio: "0.1"
id: "01H555GB80GAZ3XHHGXBM5V7JC"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00556782"
effective: "2023-07-12T12:47:00Z"
recorded: "2023-07-12T13:44:00Z"
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

**Interval.** No overnight events. He feels much better, has less nausea and is breathing comfortably. He has no known drug allergies.

**Exam.** Vitals at 07:27: BP 120/72, HR 83, RR 21, temperature 98.1 F, SpO2 97%. Mucous membranes are moist. Lungs clear, abdomen soft and nontender.

**Results.** <ref id="bmp">Basic metabolic panel at 06:12: sodium 132 mmol/L (L), potassium 4.4 mmol/L, chloride 104 mmol/L, bicarbonate 20 mmol/L (L), anion gap 8 mmol/L, urea nitrogen 22 mg/dL, creatinine 1.05 mg/dL (H), eGFR 66 mL/min/1.73m2, glucose 144 mg/dL (H).</ref> The gap has closed, and sodium, potassium and creatinine are all improving.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, improving. The <ref id="iv_insulin">insulin infusion per DKA protocol at 0.1 units/kg/h</ref> is still running this morning. <ref id="sc_glargine">Insulin glargine 14 units subcutaneously daily was started at 07:00</ref> so basal insulin is on board. Continue to follow glucose and the metabolic panel.
2. Hyponatremia is improving with fluids.
3. Home empagliflozin, metformin and losartan remain held for now.
4. Endocrinology has been asked to see him today.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6760052",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-07-11T02:05:00Z",
    "admitted": "2023-07-11T05:53:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-07-12T12:27:00Z",
    "bp": { "systolic_mmhg": 120, "diastolic_mmhg": 72 },
    "heart_rate_bpm": 83,
    "resp_rate_per_min": 21,
    "temp_f": 98.1,
    "spo2_pct": 97,
    "weight_kg": 75.1
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
    "accession": "L23193-9956",
    "collected": "2023-07-12T11:12:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "20",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.05",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "66",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
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
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2023-07-11T03:15:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2023-07-12T12:00:00Z"
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
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
