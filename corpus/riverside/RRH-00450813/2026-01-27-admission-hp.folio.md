---
folio: "0.1"
id: "01KFZM1QM0CZ9RBREAHGHHV7FN"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00450813"
effective: "2026-01-27T09:47:00Z"
recorded: "2026-01-27T11:40:00Z"
author:
  id: "urn:riverside-regional:staff:31920"
  name: "Luis Castellano, MD"
  role: "Hospitalist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Admission history and physical

**Reason for admission:** euglycemic diabetic ketoacidosis.

**History of present illness.** The patient was seen in the ED overnight with several days of nausea, fatigue and, tonight, shortness of breath with rapid, deep breathing. Evaluation showed a profound anion gap metabolic acidosis with a glucose of only 219. No clear precipitant was identified: no infection, no missed meals reported, no alcohol, no recent surgery. The patient takes <ref id="med_dapagliflozin">dapagliflozin 10 mg daily</ref>, which is now held.

**Home medications.** Metformin 1000 mg twice daily with meals, lisinopril 40 mg daily, amlodipine 5 mg daily and atorvastatin 40 mg nightly, in addition to dapagliflozin. **Allergies:** none known.

**Exam.** Vitals at 03:37: BP 114/68, HR 84, RR 23, T 98.2 F, SpO2 95%. Tired but alert, with deep respirations. Mucous membranes slightly dry. Abdomen soft and non-tender. Lungs clear.

**Results.** On the 00:04 panel sodium was 135, potassium 5.1, chloride 97, bicarbonate 8, anion gap 30, urea nitrogen 38, creatinine 1.39, eGFR 54 and glucose 219.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. Insulin infusion per DKA protocol at 0.1 units/kg/h has run since 00:51, with D5 lactated Ringer's at 150 mL/h since the same time. Chemistry will be rechecked serially until the gap closes.
2. <ref id="med_metformin">Hold metformin</ref> while acidotic and NPO.
3. <ref id="med_lisinopril">Hold lisinopril</ref> for volume depletion and potassium; resume when eating.
4. Dapagliflozin remains held.
5. Hypertension and lipids: amlodipine and atorvastatin continue.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6805361",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2026-01-27T05:41:00Z",
    "admitted": "2026-01-27T08:50:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2026-01-27T09:37:00Z",
    "bp": { "systolic_mmhg": 114, "diastolic_mmhg": 68 },
    "heart_rate_bpm": 84,
    "resp_rate_per_min": 23,
    "temp_f": 98.2,
    "spo2_pct": 95,
    "weight_kg": 82.1
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
    "accession": "L26027-7114",
    "collected": "2026-01-27T06:04:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "135",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "5.1", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "97",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "8",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "LL"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "30",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "38",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.39",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "54",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "219",
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
    "started": "2026-01-27T06:51:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2026-01-27T06:51:00Z"
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
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold while acidotic and NPO"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
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
  }
}
```
