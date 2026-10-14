---
folio: "0.1"
id: "01KB10K600T74569VR11PSZVF3"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00509215"
effective: "2025-11-26T19:26:00Z"
recorded: "2025-11-26T21:20:00Z"
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

**Reason for consult:** euglycemic diabetic ketoacidosis on an SGLT2 inhibitor.

**History.** The patient was admitted the evening of 11/25 with ketoacidosis and a near-normal glucose. Beta-hydroxybutyrate on arrival was 5.4 mmol/L at 19:26. An insulin infusion per DKA protocol ran from 20:15 on 11/25 until 09:00 on 11/26. Home medications include metformin 1000 mg twice daily (held), glipizide 5 mg daily, insulin glargine 10 units nightly and amlodipine 10 mg daily (all continued). Allergy: lisinopril (angioedema).

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, improving with treatment. Basal insulin has been transitioned: <ref id="sc_glargine">insulin glargine 12 units subcutaneously daily, started 11/26 at 07:00</ref>, and it continues.
2. <ref id="med_empagliflozin">Empagliflozin is held, and I recommend against restarting it at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Metformin remains held for now.

We are glad to see the patient again in clinic and will follow along while they are in the hospital.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6243308",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-11-26T01:05:00Z",
    "admitted": "2025-11-26T05:35:00Z"
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
    "accession": "L25329-4257",
    "collected": "2025-11-26T01:26:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.4",
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
    "started": "2025-11-26T02:15:00Z",
    "stopped": "2025-11-26T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "12 units daily",
    "started": "2025-11-26T13:00:00Z"
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
  "med_glargine": {
    "type": "home_med",
    "drug_name": "insulin glargine 100 units/mL pen",
    "rxnorm_ingredient": "274783",
    "dose_text": "10 units",
    "sig": "10 units SubQ nightly",
    "status": "continue"
  },
  "med_amlodipine": {
    "type": "home_med",
    "drug_name": "amlodipine 10 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
