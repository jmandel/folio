---
folio: "0.1"
id: "01HQBYXBE0C7Y0BE1G6ES7XEHC"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00228871"
effective: "2024-02-23T20:18:00Z"
recorded: "2024-02-23T21:46:00Z"
author:
  id: "urn:riverside-regional:staff:22905"
  name: "Elena Vasquez, MD"
  role: "Endocrinologist"
schema:
  url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts"
  type: "RiversideEntry"
  sha256: "3c7974c615bd3549c9f0a077ac238a503fe8bc93e4d92c817c68a38719ccee33"
---
## Endocrinology consultation

**Reason for consultation:** <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>, requested by the hospitalist.

**History.** The patient was admitted on 2/22 with a wide gap acidosis and a beta-hydroxybutyrate of 4.9 despite a near-normal glucose. At home the patient takes empagliflozin 10 mg daily. The insulin infusion per DKA protocol ran from 14:58 on 2/22 until 09:00 today. No known drug allergies.

**Medications.** Metformin is held. Glipizide 5 mg daily and levothyroxine 75 mcg daily continue.

**Assessment and plan**

1. Euglycemic DKA, resolving. Basal insulin was started this morning: <ref id="sc_glargine">insulin glargine 17 units subcutaneously daily, first dose 07:00</ref>, given before the infusion was stopped so there is no gap in coverage. Continue to monitor chemistry and ketones until the anion gap stays closed.
2. SGLT2 inhibitor: Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first. <ref id="med_empagliflozin">Recommend against restarting empagliflozin at discharge.</ref>
3. Education: we will review with the patient the symptoms that should prompt an early visit, including nausea, vomiting, abdominal pain and fast breathing, even when glucose readings look reassuring.
4. Outpatient diabetes follow-up to be arranged with primary care. Thank you for involving us; we will continue to follow while inpatient.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6563461",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-02-22T19:48:00Z",
    "admitted": "2024-02-23T00:14:00Z"
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
    "accession": "L24053-3386",
    "collected": "2024-02-22T20:07:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "4.9",
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
    "started": "2024-02-22T20:58:00Z",
    "stopped": "2024-02-23T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "17 units daily",
    "started": "2024-02-23T13:00:00Z"
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
  "med_glipizide": {
    "type": "home_med",
    "drug_name": "glipizide 5 mg tablet",
    "rxnorm_ingredient": "4821",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
