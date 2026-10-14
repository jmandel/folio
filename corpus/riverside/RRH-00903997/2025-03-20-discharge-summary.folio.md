---
folio: "0.1"
id: "01JPTTYKR0A3C6VEWNSF85SF4G"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00903997"
effective: "2025-03-15T06:13:00Z"
effective_end: "2025-03-20T17:30:00Z"
recorded: "2025-03-20T22:32:00Z"
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

**Hospital course.** The patient was admitted from the emergency department with several days of cough, fever and chest discomfort. She was treated with IV antibiotics and, early on, IV saline for a low sodium and elevated urea nitrogen. Her cough and breathing gradually improved and she was eating and walking without difficulty. The <ref id="dx_pneumonia">community-acquired pneumonia has resolved</ref>.

**Condition at discharge.** Vitals at 09:30: BP 135/81, HR 81, RR 17, T 98.7 F, SpO2 98%. She is comfortable and breathing easily.

**Discharge labs.** On the 06:11 panel on 3/20: sodium 133 (L), potassium 3.9, chloride 104, bicarbonate 23, anion gap 6 (L), urea nitrogen 15, creatinine 0.80, eGFR 84 and glucose 166 (H).

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals, continue</ref>
- Losartan 50 mg by mouth daily, continue
- Hydrochlorothiazide 25 mg by mouth daily, continue
- Atorvastatin 20 mg by mouth nightly, continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck her symptoms and chest exam. She should return sooner for worsening cough, fever or shortness of breath.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6895131",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-03-15T03:12:00Z",
    "admitted": "2025-03-15T06:13:00Z",
    "discharged": "2025-03-20T17:30:00Z",
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
    "taken": "2025-03-20T14:30:00Z",
    "bp": { "systolic_mmhg": 135, "diastolic_mmhg": 81 },
    "heart_rate_bpm": 81,
    "resp_rate_per_min": 17,
    "temp_f": 98.7,
    "spo2_pct": 98,
    "weight_kg": 103.9
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25079-9082",
    "collected": "2025-03-20T11:11:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "104", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "6",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "L"
      },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "15", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.80",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "84",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "166",
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
    "drug_name": "atorvastatin 20 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "20 mg",
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
