---
folio: "0.1"
id: "01JVZXQ2H0RPTECM077Y10B7ZM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00499358"
effective: "2025-05-20T04:10:00Z"
effective_end: "2025-05-23T20:15:00Z"
recorded: "2025-05-24T01:15:00Z"
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

**Reason for admission:** community-acquired pneumonia.

**Hospital course.** The patient was admitted with cough and shortness of breath and treated for pneumonia. Kidney function was elevated on arrival and improved steadily with intravenous fluids. By discharge <ref id="dx_pneumonia">the pneumonia had resolved</ref> clinically, and cough and breathing were much better.

**Discharge exam.** Vitals at 12:15: BP 120/72, HR 82, RR 20, T 99.2 F, SpO2 97%. Comfortable and breathing easily.

**Discharge labs.** Basic metabolic panel 5/23 at 06:22: sodium 133 (L), potassium 3.9, chloride 103, bicarbonate 21 (L), anion gap 9, urea nitrogen 17, creatinine 1.63 (H), eGFR 45 (L), glucose 136 (H).

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg, one tablet by mouth twice daily with meals; continue</ref>
- Dapagliflozin 10 mg, one tablet by mouth daily; continue
- Semaglutide 0.5 mg subcutaneously weekly; continue
- Lisinopril 40 mg, one tablet by mouth daily; continue
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) by mouth daily; continue
- Amlodipine 5 mg, one tablet by mouth daily; continue
- Atorvastatin 40 mg, one tablet by mouth nightly; continue

**Follow-up.** See primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. Return sooner for worsening cough, shortness of breath or fever.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6393839",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-05-20T00:48:00Z",
    "admitted": "2025-05-20T04:10:00Z",
    "discharged": "2025-05-23T20:15:00Z",
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
    "taken": "2025-05-23T17:15:00Z",
    "bp": { "systolic_mmhg": 120, "diastolic_mmhg": 72 },
    "heart_rate_bpm": 82,
    "resp_rate_per_min": 20,
    "temp_f": 99.2,
    "spo2_pct": 97,
    "weight_kg": 105.3
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25143-7475",
    "collected": "2025-05-23T11:22:00Z",
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
        "value": "21",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "9", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "17", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.63",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "45",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "136",
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
  "med_semaglutide": {
    "type": "home_med",
    "drug_name": "semaglutide pen",
    "rxnorm_ingredient": "1991302",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
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
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
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
