---
folio: "0.1"
id: "01JGFAR3N06CZZ70RSTF941EHE"
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
## Consult note

- <ref id="dx_dka">diagnosis "Euglycemic DKA, SGLT2 inhibitor-associated", status active</ref>
- <ref id="med_empagliflozin">home med empagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (advise_against) "Recommend against restarting at discharge"</ref>
- <ref id="sc_glargine">inpatient order insulin glargine SubQ 17 units daily, started 12/31 07:00, still running (local times)</ref>
- Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6162913",
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
    "accession": "L24365-1389",
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
