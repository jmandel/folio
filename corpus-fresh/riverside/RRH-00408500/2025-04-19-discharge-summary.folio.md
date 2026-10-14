---
folio: "0.1"
id: "01JS81ECX0T5XGCSAK9JZBMRZX"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00408500"
effective: "2025-04-16T02:20:00Z"
effective_end: "2025-04-19T16:45:00Z"
recorded: "2025-04-19T22:07:00Z"
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

**Reason for hospitalization:** pneumonia with poor oral intake and elevated creatinine.

**Hospital course.** The patient was admitted with cough, fatigue and shortness of breath. Admission vitals showed a heart rate near 100 and respiratory rate in the low 20s, with oxygen saturation of 94 to 97%. Treatment was started in the ED and continued on the ward, with intravenous fluids given for reduced intake and elevated urea nitrogen and creatinine. Fluids were stopped on 4/16 once the patient was drinking well. Over the stay the cough, energy and breathing improved. <ref id="dx_pneumonia">Community-acquired pneumonia has resolved clinically</ref>.

**Kidney function.** Creatinine improved steadily from 1.69 on admission to 1.39 on the panel drawn 4/19 at 06:02, with eGFR 49.

**Discharge labs (4/19 06:02).** Sodium 138, potassium 3.9, chloride 101, bicarbonate 21, anion gap 16, urea nitrogen 18, creatinine 1.39, glucose 142.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals: continue</ref>
- Empagliflozin 10 mg by mouth daily: continue
- Insulin glargine 10 units subcutaneously nightly: continue
- Lisinopril 40 mg by mouth daily: continue
- Rosuvastatin 20 mg by mouth nightly: continue

The metformin and empagliflozin that were held during the acute illness are to be taken again as listed, now that the patient is eating normally.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient was advised to return for worsening shortness of breath, fever, chest pain or inability to keep down fluids.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6426033",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-04-15T21:48:00Z",
    "admitted": "2025-04-16T02:20:00Z",
    "discharged": "2025-04-19T16:45:00Z",
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
    "taken": "2025-04-19T13:45:00Z",
    "bp": { "systolic_mmhg": 119, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 102,
    "resp_rate_per_min": 22,
    "temp_f": 98.3,
    "spo2_pct": 94,
    "weight_kg": 95.1
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25109-1163",
    "collected": "2025-04-19T11:02:00Z",
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
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "18", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.39",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "49",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "142",
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
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
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
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 50 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "50 mg",
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
