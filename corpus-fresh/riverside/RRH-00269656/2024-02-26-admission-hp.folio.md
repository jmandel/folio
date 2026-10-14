---
folio: "0.1"
id: "01HQMBATQ0DD8VNFA0W5B502X4"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00269656"
effective: "2024-02-27T01:29:00Z"
recorded: "2024-02-27T03:57:00Z"
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

**Reason for admission:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>.

**History of present illness.** The patient is a person with type 2 diabetes and hypertension who underwent elective knee replacement surgery. <ref id="precipitant">The ketoacidosis was precipitated by elective knee replacement surgery with prolonged pre-operative fasting while the SGLT2 inhibitor was continued.</ref> Today they developed nausea, abdominal discomfort and fast breathing, and were found in the ED to be acidotic with a glucose of only 199. They have no history of DKA.

**Home medications.** <ref id="med_dapagliflozin">Dapagliflozin 10 mg daily is held</ref>. <ref id="med_metformin">Metformin 1000 mg twice daily is held while acidotic and NPO</ref>, to be resumed when able. <ref id="med_losartan">Losartan 100 mg daily continues</ref>. Glipizide 5 mg daily and atorvastatin 20 mg nightly continue. Amlodipine 10 mg daily is on the list and has not been reconciled.

**Allergies:** lisinopril (angioedema).

**Exam.** Vitals at 19:19: BP 127/76, HR 98, RR 18, T 98.3 F, SpO2 94%. Mildly dry mucous membranes. Breathing is somewhat deep. Abdomen is soft. The knee dressing is clean and dry.

**Results.** The panel drawn 15:28 showed sodium 131, potassium 4.8, chloride 92, bicarbonate 13, anion gap 26, urea nitrogen 37, creatinine 1.62, eGFR 45 and glucose 199.

**Assessment and plan**

1. Euglycemic DKA as above. Continue the insulin infusion per DKA protocol at 0.1 units/kg/h, started 16:22, with D5 lactated Ringer's at 150 mL/h since glucose is near normal. Follow the panel and ketones closely until the gap closes.
2. Hyponatremia, sodium 131, likely from volume depletion; follow with fluids.
3. Kidney function: creatinine 1.62; recheck in the morning.
4. Diabetes and other medications as listed above.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6875973",
    "document_kind": "hp",
    "class": "inpatient",
    "service": "Hospital Medicine",
    "arrived": "2024-02-26T21:12:00Z",
    "admitted": "2024-02-27T00:39:00Z"
  },
  "vs_1": {
    "type": "vitals",
    "taken": "2024-02-27T01:19:00Z",
    "bp": { "systolic_mmhg": 127, "diastolic_mmhg": 76 },
    "heart_rate_bpm": 98,
    "resp_rate_per_min": 18,
    "temp_f": 98.3,
    "spo2_pct": 94,
    "weight_kg": 101
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
    "accession": "L24057-8959",
    "collected": "2024-02-26T21:28:00Z",
    "specimen": "serum",
    "status": "final",
    "components": [
      {
        "test": { "local_code": "NA", "loinc": "2951-2", "name": "Sodium" },
        "value": "131",
        "unit": "mmol/L",
        "ref_range": "136-145",
        "flag": "L"
      },
      { "test": { "local_code": "K", "loinc": "2823-3", "name": "Potassium" }, "value": "4.8", "unit": "mmol/L", "ref_range": "3.5-5.1" },
      {
        "test": { "local_code": "CL", "loinc": "2075-0", "name": "Chloride" },
        "value": "92",
        "unit": "mmol/L",
        "ref_range": "98-107",
        "flag": "L"
      },
      {
        "test": { "local_code": "CO2", "loinc": "2028-9", "name": "Bicarbonate (total CO2)" },
        "value": "13",
        "unit": "mmol/L",
        "ref_range": "22-29",
        "flag": "L"
      },
      {
        "test": { "local_code": "AGAP", "loinc": "33037-3", "name": "Anion gap" },
        "value": "26",
        "unit": "mmol/L",
        "ref_range": "7-16",
        "flag": "H"
      },
      {
        "test": { "local_code": "BUN", "loinc": "3094-0", "name": "Urea nitrogen" },
        "value": "37",
        "unit": "mg/dL",
        "ref_range": "8-23",
        "flag": "H"
      },
      {
        "test": { "local_code": "CREAT", "loinc": "2160-0", "name": "Creatinine" },
        "value": "1.62",
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
        "value": "199",
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
    "started": "2024-02-26T22:22:00Z"
  },
  "iv_d5lr": {
    "type": "inpatient_med",
    "drug_name": "dextrose 5% in lactated Ringer's",
    "route": "IV",
    "dose_text": "150 mL/h",
    "started": "2024-02-26T22:22:00Z"
  },
  "alg_lisinopril": {
    "type": "allergy",
    "substance": "lisinopril",
    "rxnorm_ingredient": "29046",
    "reaction": "angioedema",
    "severity": "severe"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "not_reconciled"
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
