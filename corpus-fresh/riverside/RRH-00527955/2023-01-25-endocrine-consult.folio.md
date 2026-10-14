---
folio: "0.1"
id: "01GQNA4G30RSRGVXNJ8MW64GVE"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00527955"
effective: "2023-01-25T18:28:00Z"
recorded: "2023-01-25T20:33:00Z"
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

**Reason for consultation:** euglycemic diabetic ketoacidosis in a patient taking an SGLT2 inhibitor.

**History.** The patient was admitted on 1/23 with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. Beta-hydroxybutyrate on arrival was 5.0 mmol/L. He had been on empagliflozin at home and had been eating poorly during an acute illness. He has no known drug allergies.

**Hospital course.** The insulin infusion per DKA protocol ran from 22:44 on 1/23 until 09:00 on 1/25, after the anion gap closed. Subcutaneous basal insulin was started ahead of the transition: <ref id="sc_glargine">insulin glargine 11 units daily, begun at 07:00 on 1/25</ref>. This overlap with the infusion was intentional, so that he is not left without insulin when the drip stops.

**Assessment and plan**

1. Euglycemic DKA has resolved biochemically and he is transitioning to subcutaneous insulin. Continue glargine and monitor glucose before meals and at bedtime.
2. <ref id="med_empagliflozin">Recommend against restarting empagliflozin at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Metformin remains on hold for now; lisinopril continues per the primary team.
4. Diabetes education before discharge should cover ketone symptoms, what to do when he cannot eat or drink, and when to seek care.

Thank you for involving us. We will follow along until discharge.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6706334",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2023-01-24T03:34:00Z",
    "admitted": "2023-01-24T09:02:00Z"
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
    "accession": "L23023-6912",
    "collected": "2023-01-24T04:08:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.0",
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
    "started": "2023-01-24T04:44:00Z",
    "stopped": "2023-01-25T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "11 units daily",
    "started": "2023-01-25T13:00:00Z"
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
    "status": "continue"
  },
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
