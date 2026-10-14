---
folio: "0.1"
id: "01KE0DK3H0CPEHQ8X4NQYM6WWE"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00449604"
effective: "2025-12-29T23:57:00Z"
effective_end: "2026-01-02T19:15:00Z"
recorded: "2026-01-02T22:35:00Z"
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

**Hospital course.** The patient was admitted with a cough and a lung infection and treated in the hospital with intravenous fluids and antibiotics. Her breathing and energy improved steadily over the stay. Her <ref id="dx_pneumonia">community-acquired pneumonia has resolved</ref>. Her kidney numbers and sodium, which were off on arrival, returned to near normal.

**Condition at discharge.** On the day of discharge she was comfortable and eating. Vitals at 10:15: BP 125/75, HR 88, RR 23, T 99.1 F, SpO2 95%.

**Results.** Final basic metabolic panel on 1/2 at 06:04: sodium 134, potassium 3.9, chloride 99, bicarbonate 24, anion gap 11, urea nitrogen 21, creatinine 0.90, eGFR 71 and glucose 164.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg tablet, 1 tablet by mouth twice daily with meals; continue.</ref>
- Empagliflozin 10 mg tablet, 1 tablet by mouth daily; continue.
- Lisinopril 20 mg tablet, 1 tablet by mouth daily; continue.
- Atorvastatin 20 mg tablet, 1 tablet by mouth nightly; continue.

**Follow-up.** She will see her primary care physician at Northgate Family Medicine within 1 week to recheck her symptoms and chest exam. She should return sooner for worsening shortness of breath, fever or any new concern.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6022676",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-12-29T20:48:00Z",
    "admitted": "2025-12-29T23:57:00Z",
    "discharged": "2026-01-02T19:15:00Z",
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
    "taken": "2026-01-02T16:15:00Z",
    "bp": { "systolic_mmhg": 125, "diastolic_mmhg": 75 },
    "heart_rate_bpm": 88,
    "resp_rate_per_min": 23,
    "temp_f": 99.1,
    "spo2_pct": 95,
    "weight_kg": 89.5
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26002-7350",
    "collected": "2026-01-02T12:04:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "134",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "21", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "0.90",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "71",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "164",
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
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
