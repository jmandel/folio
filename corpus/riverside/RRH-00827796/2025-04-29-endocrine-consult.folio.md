---
folio: "0.1"
id: "01JT1NRCX0284AE0ANYWA9YD5E"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00827796"
effective: "2025-04-29T19:43:00Z"
recorded: "2025-04-29T21:03:00Z"
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

**Reason for consult:** euglycemic DKA.

**History.** The patient was admitted 4/28 with ketoacidosis, glucose 192 and beta-hydroxybutyrate 4.2 on arrival. The IV insulin infusion ran from 4/28 15:22 until 09:00 today. Allergy: lisinopril (cough).

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, improving. <ref id="sc_glargine">Insulin glargine 18 units subcutaneously daily, started 4/29 at 07:00,</ref> overlapped the infusion before it came off, and continues.
2. <ref id="med_empagliflozin">Recommend against restarting empagliflozin at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Metformin and hydrochlorothiazide are held; losartan and semaglutide continue, as in the primary team's orders.

Thank you for this consult. We will follow along.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6322209",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-04-28T19:12:00Z",
    "admitted": "2025-04-28T22:43:00Z"
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
    "accession": "L25118-6863",
    "collected": "2025-04-28T19:28:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "4.2",
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
    "started": "2025-04-28T20:22:00Z",
    "stopped": "2025-04-29T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2025-04-29T12:00:00Z"
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
  "med_semaglutide": {
    "type": "home_med",
    "drug_name": "semaglutide pen",
    "rxnorm_ingredient": "1991302",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
    "status": "continue"
  },
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_hydrochlorothiazide": {
    "type": "home_med",
    "drug_name": "hydrochlorothiazide 25 mg tablet",
    "rxnorm_ingredient": "5487",
    "dose_text": "25 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  }
}
```
