---
folio: "0.1"
id: "01JZGZWAH0AN6SF3K3NXDY9659"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00628122"
effective: "2025-07-02T08:00:00Z"
effective_end: "2025-07-06T18:15:00Z"
recorded: "2025-07-06T23:07:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis.** <ref id="dx_pneumonia">Community-acquired pneumonia</ref>, resolved.

**Hospital course.** The patient was admitted with cough and fever and an elevated white count of 15.7, and was treated with intravenous ceftriaxone and saline. Cough, fever and breathing improved steadily over the stay. Creatinine was 2.09 on arrival and improved to 1.82 by the day of discharge.

**Results at discharge.** BMP on 7/6 at 06:26: sodium 135 (L), potassium 3.9, chloride 104, bicarbonate 22, anion gap 9, urea nitrogen 27 (H), creatinine 1.82 (H), eGFR 42 (L), glucose 111 (H).

**Condition at discharge.** Vitals at 10:15: BP 137/82, HR 79, RR 19, T 98.2 F, SpO2 94%. The patient is eating and walking without difficulty and feels well enough to go home. Allergies: NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue.</ref>
- Empagliflozin 10 mg daily: continue.
- Lisinopril 20 mg daily: continue.
- Amlodipine 5 mg daily: continue.

**Follow-up.** Northgate Family Medicine (primary care) within 1 week to recheck symptoms and the chest exam.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6446313",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-07-02T03:34:00Z",
    "admitted": "2025-07-02T08:00:00Z",
    "discharged": "2025-07-06T18:15:00Z",
    "disposition": "home"
  },
  "dx_pneumonia": {
    "type": "diagnosis",
    "label": "Community-acquired pneumonia",
    "icd10cm": "J18.9",
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-07-06T15:15:00Z",
    "bp": { "systolic_mmhg": 137, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 19,
    "temp_f": 98.2,
    "spo2_pct": 94,
    "weight_kg": 96.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25187-1827",
    "collected": "2025-07-06T11:26:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "27",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.82",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "42",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "111",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
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
    "status": "continue"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
