---
folio: "0.1"
id: "01JB7X2SN0Q3PH17EXGDE7WTH7"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00224762"
effective: "2024-10-23T02:02:00Z"
effective_end: "2024-10-27T17:30:00Z"
recorded: "2024-10-27T21:11:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis.** <ref id="dx_pneumonia">Community-acquired pneumonia, resolved</ref>.

**Hospital course.** Mr. Dalton was admitted from the ED with several days of productive cough, fever and shortness of breath, and a chest film showing a right lower lobe opacity. He had a high white count, a low bicarbonate and a creatinine of 1.84 on arrival. He received ceftriaxone and normal saline. The fluids were stopped on the evening of 10/23. His cough eased, his breathing improved and he began walking in the hall without difficulty. During the stay metformin and empagliflozin were held while he was acutely ill and his kidney function recovered.

**Results at discharge.** The panel on the morning of 10/27 (06:02) showed sodium 139, potassium 3.9, chloride 102, bicarbonate 24, anion gap 13, urea nitrogen 30 (high), creatinine 1.31 (high), eGFR 51 (low) and glucose 139 (high). Creatinine has improved steadily from 1.84 on admission.

**Condition at discharge.** Vitals at 09:30: BP 125/75, HR 99, RR 24, T 99.1 F, SpO2 95%. He is comfortable, eating, and walking independently.

**Allergies:** lisinopril (angioedema).

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals, continue</ref>
- Empagliflozin 10 mg by mouth daily, continue
- Insulin glargine 14 units subcutaneously nightly, continue
- Losartan 100 mg by mouth daily, continue
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) by mouth daily, continue
- Amlodipine 10 mg by mouth daily, continue
- Atorvastatin 40 mg by mouth nightly, continue
- Levothyroxine 75 mcg by mouth daily, continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck his symptoms and chest exam. He should return sooner for worsening cough, fever or shortness of breath.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6382106",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-10-22T20:34:00Z",
    "admitted": "2024-10-23T02:02:00Z",
    "discharged": "2024-10-27T17:30:00Z",
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
    "taken": "2024-10-27T14:30:00Z",
    "bp": { "systolic_mmhg": 125, "diastolic_mmhg": 75 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 24,
    "temp_f": 99.1,
    "spo2_pct": 95,
    "weight_kg": 69.9
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24301-3347",
    "collected": "2024-10-27T11:02:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "102", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "13", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.31",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "51",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "139",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
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
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
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
