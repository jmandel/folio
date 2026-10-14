---
folio: "0.1"
id: "01K72P4NB0VS8ME2AVEWNCKN48"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00750259"
effective: "2025-10-04T03:41:00Z"
effective_end: "2025-10-08T16:45:00Z"
recorded: "2025-10-08T19:53:00Z"
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

**Diagnosis:** <ref id="dx_pneumonia">Community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient was admitted with community-acquired pneumonia and acute changes in kidney function after several days of poor intake. She was treated in the hospital and received IV fluids, and her breathing, vital signs and laboratory values improved over the stay. Metformin and dapagliflozin were held during the acute illness. She has no known drug allergies.

**Condition at discharge.** On the morning of 10/8 she felt well and was comfortable. Vitals at 08:45: BP 120/72, HR 98, RR 20, T 98.7 F, SpO2 97%.

**Discharge labs.** The basic metabolic panel drawn 10/8 at 06:11 showed sodium 135, potassium 3.9, chloride 99, bicarbonate 26, anion gap 10, urea nitrogen 33, creatinine 1.34 (eGFR 63) and glucose 155. Creatinine has improved from 1.63 on arrival.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg tablet, 1 tablet by mouth twice daily with meals: continue</ref>
- Dapagliflozin 10 mg tablet, 1 tablet by mouth daily: continue
- Lisinopril 20 mg tablet, 1 tablet by mouth daily: continue
- Rosuvastatin 20 mg tablet, 1 tablet by mouth nightly: continue

**Follow-up.** She will see her primary care clinic, Northgate Family Medicine, within 1 week to recheck her symptoms and chest exam. She should return sooner for worsening cough, shortness of breath or fever.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6333544",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-10-03T22:55:00Z",
    "admitted": "2025-10-04T03:41:00Z",
    "discharged": "2025-10-08T16:45:00Z",
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
    "taken": "2025-10-08T13:45:00Z",
    "bp": { "systolic_mmhg": 120, "diastolic_mmhg": 72 },
    "heart_rate_bpm": 98,
    "resp_rate_per_min": 20,
    "temp_f": 98.7,
    "spo2_pct": 97,
    "weight_kg": 101.8
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25281-4455",
    "collected": "2025-10-08T11:11:00Z",
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
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "10", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "33",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.34",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "63",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "155",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
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
