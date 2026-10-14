---
folio: "0.1"
id: "01JDZNVS20026XD21695A0VXT8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00298275"
effective: "2024-11-27T07:16:00Z"
effective_end: "2024-11-30T20:15:00Z"
recorded: "2024-11-30T23:18:00Z"
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

**Reason for admission:** pneumonia.

**Hospital course.** The patient was admitted from the ED after several days of cough, fever and shortness of breath. Her <ref id="dx_pneumonia">community-acquired pneumonia has resolved</ref> with treatment. Her admission chemistry showed a low bicarbonate, raised anion gap and elevated creatinine of 2.11, and these improved with intravenous fluids and as she began eating again. Metformin and empagliflozin were held during the acute illness and are now being restarted. Allergies: NKDA.

**Condition at discharge.** Vitals at 11:15: BP 136/82, HR 104, RR 22, T 98.9 F, SpO2 98%. She is breathing comfortably, eating, and walking without difficulty. Her heart rate and breathing rate were mildly fast at that reading and should be rechecked at follow-up.

**Discharge labs.** Basic metabolic panel drawn 11/30 at 06:20: sodium 138, potassium 3.9, chloride 101, bicarbonate 21 (low), anion gap 16, urea nitrogen 22, creatinine 1.67 (high), eGFR 51 (low) and glucose 114 (high). Creatinine is down from 2.11 on admission but remains above normal.

**Discharge medications**

- <ref id="med_metformin">Metformin 1000 mg by mouth twice daily with meals: continue</ref>
- Empagliflozin 10 mg by mouth daily: continue
- Dulaglutide 0.5 mg subcutaneously weekly: continue
- Insulin glargine 14 units subcutaneously nightly: continue
- Lisinopril 20 mg by mouth daily: continue
- Amlodipine 5 mg by mouth daily: continue
- Atorvastatin 20 mg by mouth nightly: continue
- Her other daily home medication: continue

**Follow-up.** See primary care at Northgate Family Medicine within 1 week to recheck symptoms and the chest exam. She should return sooner for worsening cough, fever, shortness of breath or poor oral intake.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6138496",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-27T02:12:00Z",
    "admitted": "2024-11-27T07:16:00Z",
    "discharged": "2024-11-30T20:15:00Z",
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
    "taken": "2024-11-30T17:15:00Z",
    "bp": { "systolic_mmhg": 136, "diastolic_mmhg": 82 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 22,
    "temp_f": 98.9,
    "spo2_pct": 98,
    "weight_kg": 96.8
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24335-9994",
    "collected": "2024-11-30T12:20:00Z",
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
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.67",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "51",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "114",
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
    "dose_text": "14 units",
    "sig": "14 units SubQ nightly",
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
