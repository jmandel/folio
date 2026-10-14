---
folio: "0.1"
id: "01GWSXSJ40H90C2VZ71V8TGKR1"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00694329"
effective: "2023-03-30T17:05:00Z"
recorded: "2023-03-30T18:52:00Z"
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

**History.** Thank you for asking me to see this patient. They were admitted on 3/28 with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. The admission beta-hydroxybutyrate drawn 3/28 at 21:25 was 4.8 mmol/L. Home medications are <ref id="med_empagliflozin">empagliflozin 10 mg daily, held, with a recommendation against restarting at discharge</ref>, metformin 1000 mg twice daily (held), glipizide 5 mg daily, lisinopril 40 mg daily and atorvastatin 20 mg nightly. Allergies: NKDA.

**Course so far.** The insulin infusion per DKA protocol, begun 3/28 at 22:15, was stopped this morning at 09:00. <ref id="sc_glargine">Insulin glargine 18 units subcutaneously daily was started at 07:00 today</ref> so that basal coverage overlapped the end of the infusion.

**Assessment and recommendations**

1. The picture is a ketoacidosis that developed with only modestly raised glucose, which is typical of SGLT2 inhibitor exposure. The acidosis has been treated, and the patient is now moving from the infusion to subcutaneous insulin.
2. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Metformin remains held as listed. Glipizide, lisinopril and atorvastatin continue as listed.
4. We will review the patient again as the hospital team adjusts the subcutaneous insulin, and we are glad to see them in clinic after discharge.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6552462",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2023-03-29T02:05:00Z",
    "admitted": "2023-03-29T05:21:00Z"
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
    "accession": "L23087-3020",
    "collected": "2023-03-29T02:25:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "4.8",
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
    "started": "2023-03-29T03:15:00Z",
    "stopped": "2023-03-30T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2023-03-30T12:00:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 40 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "40 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
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
