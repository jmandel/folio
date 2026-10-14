---
folio: "0.1"
id: "01J8NHJ840APGBDZESHGY224VM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00351226"
effective: "2024-09-25T19:25:00Z"
recorded: "2024-09-25T21:32:00Z"
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

**Reason for consult:** ketoacidosis in a patient on an SGLT2 inhibitor.

**History.** The patient was admitted yesterday afternoon with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. Beta-hydroxybutyrate on arrival was 6.7 mmol/L (drawn 9/24 15:20). Home medications include insulin glargine 10 units nightly, metformin (held), lisinopril (held), rosuvastatin and <ref id="med_empagliflozin">empagliflozin 10 mg daily, which we recommend against restarting at discharge</ref>. No known drug allergies.

**Course.** The insulin infusion per DKA protocol ran from 15:58 on 9/24 and was stopped at 09:00 today. Subcutaneous <ref id="sc_glargine">insulin glargine 18 units daily was started at 07:00</ref> so that basal coverage overlapped the infusion before it came off.

**Assessment and plan**

1. Ketoacidosis has responded to treatment and the patient is transitioning to subcutaneous insulin. Continue the glargine dose above and reassess the dose against fasting glucose.
2. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Diabetes education before discharge, including recognition of ketoacidosis symptoms and what to do when unable to eat.
4. We will follow along while inpatient.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6343009",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-09-24T19:48:00Z",
    "admitted": "2024-09-24T22:48:00Z"
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
    "accession": "L24268-3946",
    "collected": "2024-09-24T20:20:00Z",
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
    "started": "2024-09-24T20:58:00Z",
    "stopped": "2024-09-25T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2024-09-25T12:00:00Z"
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
  "med_empagliflozin": {
    "type": "home_med",
    "drug_name": "empagliflozin 10 mg tablet",
    "rxnorm_ingredient": "1545653",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held",
    "restart_advice": "advise_against",
    "instructions": "Recommend against restarting at discharge"
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
    "status": "held"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
