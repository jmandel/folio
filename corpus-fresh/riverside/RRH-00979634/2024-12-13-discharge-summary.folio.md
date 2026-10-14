---
folio: "0.1"
id: "01JF0WYYB0T09FRTBMYNW3XPJE"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00979634"
effective: "2024-12-10T04:41:00Z"
effective_end: "2024-12-13T16:15:00Z"
recorded: "2024-12-13T20:57:00Z"
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

**Admission diagnosis:** euglycemic diabetic ketoacidosis.

**Discharge diagnosis:** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated, resolved</ref>.

**Hospital course.** The patient came to the ED on 12/9 with nausea, weakness and shortness of breath, and was found to have a bicarbonate of 11 and an anion gap of 23 with a glucose of only 156. <ref id="precipitant">The ketoacidosis was precipitated by influenza with fever and poor oral intake.</ref> He was treated with an insulin infusion per DKA protocol and dextrose-containing fluids, then moved to subcutaneous glargine with endocrinology input. <ref id="dx_pancreatitis">Pancreatitis was ruled out</ref>: lipase 26 and no abdominal findings. Hyponatremia and a mild rise in creatinine improved with fluids and eating.

**Condition at discharge.** At 07:15 on the day of discharge: BP 138/83, HR 104, RR 19, T 98.9 F, SpO2 94%. He is eating and walking without distress. Basic metabolic panel 12/13 at 06:01: sodium 134, potassium 4.3, chloride 103, bicarbonate 23, anion gap 8, BUN 15, creatinine 1.04, eGFR 68, glucose 167.

**Allergies:** none known.

**Discharge medications**

- <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily: do not resume until reviewed by PCP</ref>
- <ref id="med_metformin">Metformin 500 mg twice daily with meals: continue</ref>
- Lisinopril 20 mg daily: continue
- Amlodipine 5 mg daily: continue
- Atorvastatin 40 mg nightly: continue

**Follow-up.** Primary care (Northgate Family Medicine) within 1 week to decide whether to restart dapagliflozin and to recheck a basic metabolic panel. He was told to return for vomiting, trouble breathing or inability to eat or drink.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6405236",
    "document_kind": "discharge_summary",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-12-09T22:55:00Z",
    "admitted": "2024-12-10T04:41:00Z",
    "discharged": "2024-12-13T16:15:00Z",
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
  "dx_pancreatitis": {
    "type": "diagnosis",
    "label": "Acute pancreatitis",
    "icd10cm": "K85.90",
    "status": "ruled_out",
    "rank": "secondary"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-12-13T13:15:00Z",
    "bp": { "systolic_mmhg": 138, "diastolic_mmhg": 83 },
    "heart_rate_bpm": 104,
    "resp_rate_per_min": 19,
    "temp_f": 98.9,
    "spo2_pct": 94,
    "weight_kg": 81.4
  },
  "bmp_dc": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L24348-5437",
    "collected": "2024-12-13T12:01:00Z",
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
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.3", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      { "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" }, "value": "103", "unit": "mmol/L", "ref_range": "98-107" },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "23",
        "unit": "mmol/L",
        "ref_range": "22-29"
      },
      { "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" }, "value": "8", "unit": "mmol/L", "ref_range": "7-16" },
      { "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" }, "value": "15", "unit": "mg/dL", "ref_range": "8-23" },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.04",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "68",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "167",
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
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Do not resume until reviewed by PCP"
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
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
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
    "purpose": "Decide whether to restart dapagliflozin; recheck basic metabolic panel"
  }
}
```
