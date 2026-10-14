---
folio: "0.1"
id: "01J8N9QCS0V6KVKZWM62QK4MPF"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00054369"
effective: "2024-09-25T17:47:00Z"
recorded: "2024-09-25T19:15:00Z"
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

**Reason for consult:** euglycemic diabetic ketoacidosis in a patient taking an SGLT2 inhibitor.

**History.** Thank you for asking me to see this patient with type 2 diabetes, admitted with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. The patient had been taking <ref id="med_dapagliflozin">dapagliflozin 10 mg daily, which is held, and I recommend against restarting it at discharge</ref>. Home medications also include metformin 1000 mg twice daily with meals (held), lisinopril 10 mg daily (held) and atorvastatin 40 mg nightly (continued). No known drug allergies.

**Results.** The admission beta-hydroxybutyrate drawn at 18:09 on 9/24 was 4.3 mmol/L. The regular insulin infusion per DKA protocol, started 9/24 at 18:58, was stopped at 09:00 today. <ref id="sc_glargine">Insulin glargine 10 units subcutaneously daily was started at 07:00</ref>, so that basal insulin was on board before the infusion came off.

**Assessment and plan**

1. Euglycemic DKA, with the gap closed on the morning labs and the infusion now off. The picture fits an SGLT2 inhibitor in the setting of poor intake and illness. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
2. Basal glargine continues as ordered. We will follow along with the primary team and can see the patient again if glucose becomes difficult to manage.
3. I discussed the above with the hospitalist team.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6901265",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-09-24T22:48:00Z",
    "admitted": "2024-09-25T04:27:00Z"
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
    "accession": "L24268-4594",
    "collected": "2024-09-24T23:09:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "4.3",
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
    "started": "2024-09-24T23:58:00Z",
    "stopped": "2024-09-25T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "10 units daily",
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
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "held"
  },
  "med_atorvastatin": {
    "type": "home_med",
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
