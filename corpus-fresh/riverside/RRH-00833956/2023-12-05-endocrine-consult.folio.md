---
folio: "0.1"
id: "01HGY1GRC0Y197Y4CWT4SAX4EH"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00833956"
effective: "2023-12-05T20:21:00Z"
recorded: "2023-12-05T22:28:00Z"
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

**Reason for consult:** euglycemic ketoacidosis in a patient with diabetes on an SGLT2 inhibitor.

**History.** I was asked to see this patient on hospital day 2. They were admitted on 12/4 with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>; the admission beta-hydroxybutyrate drawn at 16:12 was 6.4 mmol/L. An insulin infusion per DKA protocol ran from 16:51 on 12/4 and was stopped at 09:00 today after the gap closed. No known drug allergies.

**Medications.** At home the patient takes metformin, dulaglutide, insulin glargine and losartan; metformin is held in hospital, and the others are continued. <ref id="med_empagliflozin">Empagliflozin 10 mg daily is held, and I recommend against restarting it at discharge.</ref> Subcutaneous <ref id="sc_glargine">insulin glargine 12 units daily was started at 07:00 today</ref> so that basal insulin overlapped the end of the infusion.

**Exam.** Comfortable, breathing normally, mucous membranes moist. Abdomen soft and non-tender.

**Assessment and plan**

1. The ketoacidosis has responded to treatment. Continue basal insulin and carbohydrate-consistent meals, and check glucose before meals and at bedtime.
2. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Reinforce with the patient that ketoacidosis can occur with near-normal glucose, and that vomiting, poor intake or heavy drinking are reasons to seek care promptly.
4. We will follow along and are glad to see the patient in clinic after discharge.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6699975",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2023-12-04T21:41:00Z",
    "admitted": "2023-12-05T01:02:00Z"
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
    "accession": "L23338-6549",
    "collected": "2023-12-04T22:12:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.4",
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
    "started": "2023-12-04T22:51:00Z",
    "stopped": "2023-12-05T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "12 units daily",
    "started": "2023-12-05T13:00:00Z"
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
  "med_dulaglutide": {
    "type": "home_med",
    "drug_name": "dulaglutide pen",
    "rxnorm_ingredient": "1551291",
    "dose_text": "0.5 mg",
    "sig": "0.5 mg SubQ weekly",
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
