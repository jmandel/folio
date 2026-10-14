---
folio: "0.1"
id: "01KKQ1JHT0TGSMZ27SX1TDN08F"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00981873"
effective: "2026-03-10T06:51:00Z"
effective_end: "2026-03-14T17:15:00Z"
recorded: "2026-03-14T20:46:00Z"
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

**Reason for admission:** community-acquired pneumonia.

**Hospital course.** The patient was admitted with cough and shortness of breath and was found to have pneumonia. Admission labs showed bicarbonate 18, anion gap 21, urea nitrogen 48, and creatinine 2.66. Saline was given from the evening of 3/9 until 01:51 on 3/11. Over the stay the cough eased, appetite returned, and the laboratory values improved. <ref id="dx_pneumonia">Community-acquired pneumonia resolved</ref> by the time of discharge.

**Discharge data.** Vitals at 09:15: BP 123/74, HR 99, RR 18, T 99.1 F, SpO2 94%. The panel drawn 3/14 at 06:17 showed sodium 137, potassium 3.9, chloride 103, bicarbonate 23, anion gap 11, urea nitrogen 19, creatinine 1.89 (H) with eGFR 46 (L), and glucose 133 (H). Creatinine has fallen from 2.66 on admission.

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue</ref>
- Dapagliflozin 10 mg daily: continue
- Glipizide 5 mg daily: continue
- Semaglutide 0.5 mg subcutaneously weekly: continue
- Insulin glargine 10 units subcutaneously nightly: continue
- Lisinopril 40 mg daily: continue
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) daily: continue
- Amlodipine 5 mg daily: continue
- Atorvastatin 40 mg nightly: continue

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient should return sooner for worsening cough, fever, or shortness of breath.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6248732",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-03-10T01:34:00Z",
    "admitted": "2026-03-10T06:51:00Z",
    "discharged": "2026-03-14T17:15:00Z",
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
    "taken": "2026-03-14T14:15:00Z",
    "bp": { "systolic_mmhg": 123, "diastolic_mmhg": 74 },
    "heart_rate_bpm": 99,
    "resp_rate_per_min": 18,
    "temp_f": 99.1,
    "spo2_pct": 94,
    "weight_kg": 103
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L26073-8048",
    "collected": "2026-03-14T11:17:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "137", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "19", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.89",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "46",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "133",
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
  "med_semaglutide": {
    "type": "home_med",
    "drug_name": "semaglutide pen",
    "rxnorm_ingredient": "1991302",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
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
