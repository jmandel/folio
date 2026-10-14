---
folio: "0.1"
id: "01HMFD5YY0C7J8FPVWX1QJQVSA"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00147542"
effective: "2024-01-15T09:58:00Z"
effective_end: "2024-01-18T18:45:00Z"
recorded: "2024-01-18T23:06:00Z"
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

**Hospital course.** The patient was admitted with cough, breathlessness and an elevated white count, and was treated with intravenous ceftriaxone and normal saline. Admission chemistry showed a low sodium of 131 and creatinine of 1.80. With fluids and treatment the cough eased and the chemistry improved steadily. Metformin, dapagliflozin and spironolactone were held during the acute illness and are now resumed as listed below.

**Condition at discharge.** Improved. Vitals at 09:45: BP 136/82, HR 104, RR 23, T 98.5 F, SpO2 99%. The patient is eating and drinking and is comfortable.

**Discharge labs.** On the 06:12 panel: sodium 137, potassium 3.9, chloride 105, bicarbonate 22, anion gap 10, urea nitrogen 20, creatinine 1.32 (H), eGFR 59 (L), glucose 150 (H). Creatinine is back near baseline.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- Dapagliflozin 10 mg daily: continue
- Glipizide 5 mg daily: continue
- Insulin glargine 10 units nightly: continue
- Losartan 100 mg daily: continue
- Hydrochlorothiazide 25 mg daily: continue
- Carvedilol 12.5 mg twice daily: continue
- <ref id="med_spironolactone">Spironolactone 25 mg daily: continue</ref>
- Furosemide 40 mg daily: continue
- Atorvastatin 40 mg nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient was advised to return for worsening breathlessness or fever.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6091462",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-01-15T04:41:00Z",
    "admitted": "2024-01-15T09:58:00Z",
    "discharged": "2024-01-18T18:45:00Z",
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
    "taken": "2024-01-18T15:45:00Z",
    "bp": { "systolic_mmhg": 136, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 23,
    "temp_f": 98.5,
    "spo2_pct": 99,
    "weight_kg": 93.2
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24018-0560",
    "collected": "2024-01-18T12:12:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "20", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.32",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "59",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "150",
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
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
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_carvedilol": {
    "type": "home_med",
    "drug_name": "carvedilol 12.5 mg tablet",
    "rxnorm_ingredient": "20352",
    "dose_text": "12.5 mg",
    "sig": "1 tab PO BID",
    "status": "continue"
  },
  "med_spironolactone": {
    "type": "home_med",
    "drug_name": "spironolactone 25 mg tablet",
    "rxnorm_ingredient": "9997",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_furosemide": {
    "type": "home_med",
    "drug_name": "furosemide 40 mg tablet",
    "rxnorm_ingredient": "4603",
    "dose_text": "40 mg",
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
