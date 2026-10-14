---
folio: "0.1"
id: "01JGFAR3N00WPW7VH4TVY5SWAB"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00046468"
effective: "2024-12-31T19:54:00Z"
recorded: "2024-12-31T21:43:00Z"
author:
  id: "urn:riverside-regional:staff:22905"
  name: "Elena Vasquez, MD"
  role: "Endocrinologist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Endocrinology consult

**Reason for consult:** euglycemic ketoacidosis in a patient on an SGLT2 inhibitor.

**History.** The patient is a man with type 2 diabetes and hypertension admitted with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. He had been taking <ref id="med_dapagliflozin">dapagliflozin 10 mg daily</ref>. Admission beta-hydroxybutyrate was 6.7. No known drug allergies.

**Hospital course.** The insulin infusion per DKA protocol ran from 17:05 on 12/30 until 09:00 today, when it was stopped. He was started on <ref id="sc_glargine">insulin glargine 17 units daily</ref> at 07:00 today so that basal insulin was on board before the infusion came off. He has been tolerating the transition.

**Medications.** Metformin, lisinopril and chlorthalidone are held; amlodipine continues.

**Assessment and plan**

1. Euglycemic DKA, resolved on the infusion. Continue glargine and reassess the dose daily.
2. Recommend against restarting dapagliflozin at discharge. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. We will follow while he is in the hospital, and he should see his primary care physician soon after discharge.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6956329",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-12-30T21:55:00Z",
    "admitted": "2024-12-31T01:17:00Z"
  },
  "dx_dka": {
    "type": "diagnosis",
    "label": "Euglycemic DKA, SGLT2 inhibitor-associated",
    "icd10cm": "E11.10",
    "riverside_dx": { "code": "RRH-DX-4471", "name": "Euglycemic diabetic ketoacidosis, SGLT2 inhibitor-associated" },
    "status": "active"
  },
  "bhb_1": {
    "type": "result",
    "test": { "local_code": "BHB", "name": "Beta-hydroxybutyrate" },
    "accession": "L24365-7794",
    "collected": "2024-12-30T22:25:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.7",
    "unit": "mmol/L",
    "ref_range": "<0.4",
    "flag": "HH"
  },
  "iv_insulin": {
    "type": "inpatient_med",
    "drug_name": "insulin regular (human) IV infusion",
    "rxnorm_ingredient": "253182",
    "route": "IV",
    "dose_text": "per DKA protocol, 0.1 units/kg/h",
    "started": "2024-12-30T23:05:00Z",
    "stopped": "2024-12-31T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "17 units daily",
    "started": "2024-12-31T13:00:00Z"
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
    "status": "held"
  },
  "med_dapagliflozin": {
    "type": "home_med",
    "drug_name": "dapagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1488564",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Recommend against restarting at discharge"
  },
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
    "status": "held"
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
