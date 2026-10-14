---
folio: "0.1"
id: "01JDTBB7P0Q4B39YWVZY2B8VM8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00594395"
effective: "2024-11-28T20:15:00Z"
recorded: "2024-11-28T21:38:00Z"
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
- <ref id="med_dapagliflozin">home med dapagliflozin 10 mg tablet, 10 mg 1 tab PO daily: held (advise_against) "Recommend against restarting at discharge"</ref>
- <ref id="sc_glargine">inpatient order insulin glargine SubQ 18 units daily, started 11/28 07:00, still running (local times)</ref>
- Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6465390",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-11-27T21:41:00Z",
    "admitted": "2024-11-28T02:05:00Z"
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
    "accession": "L24332-1564",
    "collected": "2024-11-27T22:04:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.5",
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
    "started": "2024-11-27T22:51:00Z",
    "stopped": "2024-11-28T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2024-11-28T13:00:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
