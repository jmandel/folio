---
folio: "0.1"
id: "01JJ9SGKQ0AX55EF94NWJR831J"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00656053"
effective: "2025-01-23T13:40:00Z"
recorded: "2025-01-23T14:37:00Z"
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

**Interval.** The patient feels much better overnight, with no nausea and no abdominal pain. Vitals at 07:20: BP 131/79, HR 96, RR 18, T 98.2 F, SpO2 97%.

**Results.** The <ref id="bmp">panel at 06:18 showed sodium 136, potassium 4.4, chloride 102, bicarbonate 23, anion gap 11, urea nitrogen 21, creatinine 0.77, eGFR 82 and glucose 173</ref>. The gap has closed and the sodium and potassium have normalized.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, improving. The <ref id="iv_insulin">insulin infusion per DKA protocol, running since 00:44 on 1/22</ref>, remains on. <ref id="sc_glargine">Insulin glargine 14 units subcutaneously daily was started at 07:00</ref>.
2. Dapagliflozin remains held.
3. Metformin and losartan remain held. Amlodipine 10 mg daily continues, and blood pressure is acceptable.
4. Lisinopril allergy (angioedema) noted.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6374607",
    "document_kind": "progress_note",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-01-22T05:34:00Z",
    "admitted": "2025-01-22T09:43:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-01-23T13:20:00Z",
    "bp": { "systolic_mmhg": 131, "diastolic_mmhg": 79 },
    "heart_rate_bpm": 96,
    "resp_rate_per_min": 18,
    "temp_f": 98.2,
    "spo2_pct": 97,
    "weight_kg": 92.3
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
    "accession": "L25023-2581",
    "collected": "2025-01-23T12:18:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.4", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "21", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.77",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "82",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "173",
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
    "started": "2025-01-22T06:44:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2025-01-23T13:00:00Z"
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
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
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
