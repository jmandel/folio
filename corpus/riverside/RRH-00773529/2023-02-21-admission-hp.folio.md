---
folio: "0.1"
id: "01GSVGE6Y08HM7QPKT9P0QMH84"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00773529"
effective: "2023-02-22T00:40:00Z"
recorded: "2023-02-22T02:50:00Z"
author:
  id: "urn:riverside-regional:staff:31884"
  name: "Priya Raman, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** <ref id="dx_dka">euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated</ref>.

**History.** The patient has type 2 diabetes and hypertension and was sent up from the ED after presenting with weakness, nausea and fast breathing. <ref id="precipitant">The ketoacidosis was precipitated by a viral gastroenteritis with vomiting and almost no oral intake for several days.</ref> Her glucose in the ED was only modestly raised, which fits the euglycemic picture. She is allergic to lisinopril (cough).

**Home medications.** Empagliflozin 10 mg daily, metformin 1000 mg twice daily with meals, losartan 50 mg daily and amlodipine 5 mg daily.

**Exam.** Vitals at 18:30: BP 111/67, HR 96, RR 22, T 99.1 F, SpO2 96%. She looks tired and dry, with deep, rapid respirations. Abdomen soft and non-tender. Alert and oriented.

**Results.** The 14:58 basic metabolic panel showed sodium 132, potassium 5.0, chloride 97, bicarbonate 11, anion gap 24, urea nitrogen 26, creatinine 1.29, eGFR 47 and glucose 207.

**Assessment and plan**

1. Euglycemic DKA with an anion gap of 24 and bicarbonate of 11. The insulin infusion per DKA protocol at 0.1 units/kg/h has been running since 15:51, together with D5 lactated Ringer's at 150 mL/h, because glucose is near normal and dextrose must continue while insulin clears the ketones. Repeat chemistries on a regular schedule until the gap closes.
2. SGLT2 inhibitor exposure: <ref id="med_empagliflozin">hold empagliflozin</ref>.
3. Type 2 diabetes: <ref id="med_metformin">hold metformin</ref> while she is acidotic and NPO.
4. Hypertension: <ref id="med_losartan">hold losartan</ref> for volume depletion and the potassium of 5.0; resume when she is eating. Continue amlodipine.
5. Kidney function: creatinine 1.29 on arrival; recheck with morning labs.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6412994",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2023-02-21T20:41:00Z",
    "admitted": "2023-02-21T23:42:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2023-02-22T00:30:00Z",
    "bp": { "systolic_mmhg": 111, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 96,
    "resp_rate_per_min": 22,
    "temp_f": 99.1,
    "spo2_pct": 96,
    "weight_kg": 62.7
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active",
    "rank": "principal"
  },
  "bmp": {
    "type": "panel",
    "panel": { "local_code": "BMP", "loinc": "51990-0", "name": "Basic metabolic panel" },
    "accession": "L23052-7954",
    "collected": "2023-02-21T20:58:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "132",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.0", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "11",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "24",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "26",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.29",
        "unit": "mg/dL",
        "ref_range": "0.57-1.00",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "47",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "207",
        "unit": "mg/dL",
        "ref_range": "70-99",
        "flag": "H"
      }
    ]
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2023-02-21T21:51:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2023-02-21T21:51:00Z"
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
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while acidotic and NPO"
  },
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion and potassium; resume when eating"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
