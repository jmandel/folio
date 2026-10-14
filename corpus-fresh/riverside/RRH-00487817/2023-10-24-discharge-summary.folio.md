---
folio: "0.1"
id: "01HDJ1P6V0TJ3AA0GVYNBMA46B"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00487817"
effective: "2023-10-22T01:04:00Z"
effective_end: "2023-10-24T19:45:00Z"
recorded: "2023-10-24T23:53:00Z"
author:
  id: "urn:riverside-regional:staff:32017"
  name: "Grace Whitaker, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Discharge summary

**Diagnosis.** <ref id="dx_pneumonia">Community-acquired pneumonia, resolved.</ref>

**Hospital course.** The patient was admitted with cough, poor oral intake and a rise in creatinine. They were given intravenous fluids and antibiotics. The cough eased, breathing settled and they were eating and drinking normally. Kidney function recovered over the stay.

**Condition at discharge.** Vitals at 11:45: BP 124/74, HR 94, RR 24, T 98.7 F, SpO2 96%. They are comfortable and ready to go home.

**Discharge labs.** Basic metabolic panel drawn at 06:03 on 10/24: sodium 138, potassium 3.9, chloride 101, bicarbonate 21, anion gap 16, urea nitrogen 21, creatinine 1.22, eGFR 66, glucose 129. Creatinine is back to a normal value.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_lisinopril">Lisinopril 40 mg tablet, 1 tablet by mouth daily: continue</ref>
- <ref id="med_metformin">Metformin 500 mg tablet, 1 tablet by mouth twice daily with meals: continue</ref>
- Dapagliflozin 10 mg tablet, 1 tablet by mouth daily: continue
- Hydrochlorothiazide 25 mg tablet, 1 tablet by mouth daily: continue
- Atorvastatin 20 mg tablet, 1 tablet by mouth nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. They should return sooner for worsening breathlessness, fever or inability to keep fluids down.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6564769",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-10-21T21:41:00Z",
    "admitted": "2023-10-22T01:04:00Z",
    "discharged": "2023-10-24T19:45:00Z",
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
    "taken": "2023-10-24T16:45:00Z",
    "bp": { "systolic_mmhg": 124, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 94,
    "resp_rate_per_min": 24,
    "temp_f": 98.7,
    "spo2_pct": 96,
    "weight_kg": 85.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23297-6023",
    "collected": "2023-10-24T11:03:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "138", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "16", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "21", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.22",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "66",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "129",
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
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
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
