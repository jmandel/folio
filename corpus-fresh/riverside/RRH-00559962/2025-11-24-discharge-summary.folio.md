---
folio: "0.1"
id: "01KAVT2T60EGACJQ34CYFMFFSE"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00559962"
effective: "2025-11-20T05:59:00Z"
effective_end: "2025-11-24T16:15:00Z"
recorded: "2025-11-24T20:50:00Z"
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

**Diagnosis:** <ref id="dx_pneumonia">community-acquired pneumonia, resolved</ref>.

**Hospital course.** The patient was admitted from the ED with cough, shortness of breath and signs of dehydration. White count was raised on arrival and the chest exam showed focal crackles. Treatment was ceftriaxone 1 g IV every 24 hours, begun 11/19, and normal saline at 75 mL/h, which was stopped on 11/20. Cough and breathing improved steadily over the stay. Sodium was 131 on arrival and had returned to the normal range by 11/20. Creatinine was 1.49 on arrival and improved to 1.26 at discharge.

**Discharge exam and results.** Vitals on the morning of 11/24 at 07:15: BP 138/83, HR 79, RR 17, T 98.8 F, SpO2 95%. The patient is breathing comfortably and the lungs are clear or nearly so. Basic metabolic panel 11/24 at 06:29: sodium 136, potassium 3.9, chloride 99, bicarbonate 22, anion gap 15, urea nitrogen 26 (H), creatinine 1.26 (H), eGFR 49 (L), glucose 117 (H).

**Allergies:** NKDA.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg tablet, 1 tablet by mouth twice daily with meals: continue</ref>
- Dapagliflozin 10 mg tablet, 1 tablet by mouth daily: continue
- Dulaglutide 0.5 mg subcutaneously weekly: continue
- Insulin glargine 10 units subcutaneously nightly: continue
- Lisinopril 40 mg tablet, 1 tablet by mouth daily: continue
- Chlorthalidone 12.5 mg (half of a 25 mg tablet) by mouth daily: continue
- Amlodipine 5 mg tablet, 1 tablet by mouth daily: continue
- Atorvastatin 40 mg tablet, 1 tablet by mouth nightly: continue

**Follow-up.** The patient should see primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. The patient should return sooner for worsening cough, fever, or trouble breathing.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6377385",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-11-20T02:20:00Z",
    "admitted": "2025-11-20T05:59:00Z",
    "discharged": "2025-11-24T16:15:00Z",
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
    "taken": "2025-11-24T13:15:00Z",
    "bp": { "systolic_mmhg": 138, "diastolic_mmhg": 83 },
    "heart_rate_bpm": 79,
    "resp_rate_per_min": 17,
    "temp_f": 98.8,
    "spo2_pct": 95,
    "weight_kg": 66.6
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L25328-7180",
    "collected": "2025-11-24T12:29:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "3.9", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "99", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "22",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "15", "unit": "mmol/L", "ref_range": "7-16" },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.26",
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
        "value": "117",
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
  "med_dulaglutide": {
    "type": "home_med",
    "drug_name": "dulaglutide pen",
    "rxnorm_ingredient": "1551291",
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
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
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
