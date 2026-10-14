---
folio: "0.1"
id: "01J6QQP0J0FMY5GNJAJB3B395N"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00326340"
effective: "2024-08-27T07:31:00Z"
effective_end: "2024-09-01T17:30:00Z"
recorded: "2024-09-01T21:26:00Z"
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

**Hospital course.** The patient was admitted with cough, fatigue and breathlessness and was treated for <ref id="dx_pneumonia">community-acquired pneumonia, now resolved</ref>. On arrival the sodium was 129, urea nitrogen 42 and creatinine 1.39, which we attributed to volume depletion from the illness. These improved with IV saline, which was stopped on 8/28. Over the following days the cough eased, the oxygen saturation held steady and the patient became able to walk without difficulty. No known drug allergies.

**Condition at discharge.** Vitals at 09:30: BP 125/75, HR 84, RR 19, T 98.5 F, SpO2 96%. The patient feels well, eats normally and is ready to go home.

**Discharge labs.** Basic metabolic panel drawn on 9/1 at 06:27: sodium 133 (L), potassium 3.9, chloride 103, bicarbonate 26, anion gap 4 (L), urea nitrogen 28 (H), creatinine 1.10 (H), eGFR 52 (L) and glucose 140 (H). Creatinine is the lowest of the stay, down from 1.39 on admission. Sodium is slightly low and should be rechecked at follow-up.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg tablet, 1 tablet by mouth twice daily with meals, continue</ref>
- Losartan 50 mg tablet, 1 tablet by mouth daily, continue
- Hydrochlorothiazide 25 mg tablet, 1 tablet by mouth daily, continue
- Atorvastatin 40 mg tablet, 1 tablet by mouth nightly, continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient was advised to return sooner for worsening cough, fever or trouble breathing, and verbalized understanding.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6796761",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-08-27T01:41:00Z",
    "admitted": "2024-08-27T07:31:00Z",
    "discharged": "2024-09-01T17:30:00Z",
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
    "taken": "2024-09-01T14:30:00Z",
    "bp": { "systolic_mmhg": 125, "diastolic_mmhg": 75 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 19,
    "temp_f": 98.5,
    "spo2_pct": 96,
    "weight_kg": 96.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24245-0065",
    "collected": "2024-09-01T11:27:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "4",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "28",
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
        "value": "52",
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
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
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
  "fu_pcp": {
    "type": "follow_up",
    "with": "Primary care (Northgate Family Medicine)",
    "when_text": "within 1 week",
    "purpose": "Recheck symptoms and chest exam"
  }
}
```
