---
folio: "0.1"
id: "01K5V7SRM0KW9CVF07PWJD9N8B"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00941538"
effective: "2025-09-23T10:37:00Z"
recorded: "2025-09-23T12:12:00Z"
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

**History of present illness.** The patient came to the ED overnight with nausea, abdominal discomfort and fast breathing. <ref id="precipitant">The ketoacidosis was precipitated by a weekend of heavy alcohol use with little food.</ref> He takes empagliflozin, metformin, lisinopril, hydrochlorothiazide, amlodipine and atorvastatin at home. Allergies: NKDA.

**Exam.** Vitals at 05:27: BP 112/67, HR 112, RR 16, T 98.1 F, SpO2 95%. He looks dry, with a fast heart rate. The abdomen is soft.

**Results.** The 00:03 panel showed sodium 134, potassium 5.4, chloride 93, bicarbonate 14, anion gap 27, urea nitrogen 30, creatinine 1.76, eGFR 39 and glucose 175.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated.</ref> Continue the insulin infusion per DKA protocol (0.1 units/kg/h, started 00:51) together with D5 lactated Ringer's at 150 mL/h, since glucose is near normal. <ref id="med_empagliflozin">Hold empagliflozin.</ref>
2. Diabetes: <ref id="med_metformin">hold metformin 1000 mg twice daily</ref> while he is acidotic and NPO; resume when able.
3. Volume depletion with creatinine 1.76 and potassium 5.4: <ref id="med_hydrochlorothiazide">hold hydrochlorothiazide 25 mg</ref> for volume depletion, and <ref id="med_lisinopril">hold lisinopril 40 mg</ref> for volume depletion and potassium; resume when he is eating.
4. Hypertension: BP is soft-normal. Continue amlodipine 5 mg daily.
5. Continue atorvastatin 20 mg nightly.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6494639",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2025-09-23T04:41:00Z",
    "admitted": "2025-09-23T09:56:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2025-09-23T10:27:00Z",
    "bp": { "systolic_mmhg": 112, "diastolic_mmhg": 67 },
    "heart_rate_bpm": 112,
    "resp_rate_per_min": 16,
    "temp_f": 98.1,
    "spo2_pct": 95,
    "weight_kg": 120.2
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
    "accession": "L25266-4520",
    "collected": "2025-09-23T05:03:00Z",
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
      {
        "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" },
        "value": "5.4",
        "unit": "mmol/L",
        "ref_range": "3.5-5.1",
        "flag": "H"
      },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "93",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "14",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "27",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "30",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.76",
        "unit": "mg/dL",
        "ref_range": "0.76-1.27",
        "flag": "H"
      },
      {
        "test": { "local_code": "EGFR", "loinc": "98979-8", "name": "eGFR (CKD-EPI 2021)" },
        "value": "39",
        "unit": "mL/min/1.73m2",
        "ref_range": ">59",
        "flag": "L"
      },
      {
        "test": { "local_code": "GLU", "loinc": "2345-7", "name": "Glucose" },
        "value": "175",
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
    "started": "2025-09-23T05:51:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2025-09-23T05:51:00Z"
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
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
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
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "resume_when_able",
    "instructions": "Hold for volume depletion"
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
  }
}
```
