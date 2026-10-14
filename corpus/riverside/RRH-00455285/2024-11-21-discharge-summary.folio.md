---
folio: "0.1"
id: "01JD8GP4706YR9GMB3DB9B610Y"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00455285"
effective: "2024-11-19T03:00:00Z"
effective_end: "2024-11-21T19:15:00Z"
recorded: "2024-11-21T23:25:00Z"
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

**Diagnosis:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved.

**Hospital course.** The patient came to the ED with nausea, fatigue and fast breathing and was found to have a severe anion gap acidosis with venous pH 7.13, bicarbonate 13, anion gap 25 and beta-hydroxybutyrate 5.1, despite a glucose of only 240. <ref id="precipitant">The ketoacidosis was precipitated by elective knee replacement surgery with prolonged pre-operative fasting while the SGLT2 inhibitor was continued.</ref> He was treated with an insulin infusion per DKA protocol and dextrose-containing fluids, then transitioned to subcutaneous glargine. Endocrinology saw him and advised against restarting the SGLT2 inhibitor. The gap closed by the morning of 11/19 and he went on to eat normally.

**Condition at discharge.** Feeling well. Vitals BP 118/71, HR 83, RR 23, T 98.4 F, SpO2 96%. The final panel on 11/21 at 06:02 showed sodium 136, potassium 4.3, chloride 101, bicarbonate 24, anion gap 11, urea nitrogen 22, creatinine 1.17, eGFR 50 and glucose 168.

**Allergies:** no known drug allergies.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: do not take; do not resume until reviewed by his primary care physician.</ref>
- <ref id="med_metformin">Metformin 1000 mg twice daily with meals: continue.</ref>
- <ref id="med_hydrochlorothiazide">Hydrochlorothiazide 25 mg daily: continue.</ref>
- Losartan 50 mg daily: continue.
- Atorvastatin 40 mg nightly: continue.

**Follow-up.** Primary care at Northgate Family Medicine within 1 week to decide whether to restart dapagliflozin and to recheck a basic metabolic panel. He should return to the ED for vomiting, abdominal pain or fast breathing.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6621354",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-11-18T21:55:00Z",
    "admitted": "2024-11-19T03:00:00Z",
    "discharged": "2024-11-21T19:15:00Z",
    "disposition": "home"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "resolved",
    "rank": "principal"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-11-21T16:15:00Z",
    "bp": { "systolic_mmhg": 118, "diastolic_mmhg": 71 },
    "heart_rate_bpm": 83,
    "resp_rate_per_min": 23,
    "temp_f": 98.4,
    "spo2_pct": 96,
    "weight_kg": 90.6
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24326-6949",
    "collected": "2024-11-21T12:02:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      { "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" }, "value": "136", "unit": "mmol/L", "ref_range": "136-145" },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "101", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "11", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "22", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.17",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "50",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "168",
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
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
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
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
