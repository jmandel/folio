---
folio: "0.1"
id: "01KA4K0QR0RF78PP5QY8MD3D3A"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00135196"
effective: "2025-11-11T04:25:00Z"
effective_end: "2025-11-15T17:00:00Z"
recorded: "2025-11-15T20:24:00Z"
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

**Diagnosis.** Community-acquired pneumonia, resolved.

**Hospital course.** The patient was admitted with fever, cough and shortness of breath, with dehydration and a creatinine of 1.91 on arrival. <ref id="dx_pneumonia">Community-acquired pneumonia</ref> was treated with ceftriaxone and intravenous fluids. Fever and cough resolved and breathing returned to normal. On the final panel at 06:11 sodium was 139, potassium 3.9, chloride 105, bicarbonate 24, urea nitrogen 33, creatinine 1.52, eGFR 40 and glucose 160. Vitals at 08:00: BP 134/80, HR 112, RR 21, T 99.1 F, SpO2 98%. Allergy: lisinopril (cough).

**Discharge medications**

- <ref id="med_losartan">Losartan 50 mg daily: continue.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>
- Empagliflozin 10 mg daily: continue.
- Rosuvastatin 20 mg nightly: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient was advised to drink fluids and to return for worsening shortness of breath, recurrent fever, or chest pain.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6206906",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-11-11T00:12:00Z",
    "admitted": "2025-11-11T04:25:00Z",
    "discharged": "2025-11-15T17:00:00Z",
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
    "taken": "2025-11-15T14:00:00Z",
    "bp": { "systolic_mmhg": 134, "diastolic_mmhg": 80 },
    "heart_rate_bpm": 112,
    "resp_rate_per_min": 21,
    "temp_f": 99.1,
    "spo2_pct": 98,
    "weight_kg": 62.7
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25319-9686",
    "collected": "2025-11-15T12:11:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "139", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "105", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
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
        "value": "1.52",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "40",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "160",
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
    "reaction": "cough",
    "severity": "mild"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
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
