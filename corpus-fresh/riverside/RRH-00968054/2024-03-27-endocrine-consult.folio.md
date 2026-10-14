---
folio: "0.1"
id: "01HT0JF6G0FRH7PFZ8NVYXHHCR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00968054"
effective: "2024-03-27T17:08:00Z"
recorded: "2024-03-27T18:24:00Z"
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

**History.** Thank you for asking us to see this patient with type 2 diabetes, admitted with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. The patient presented with nausea, fatigue and deep breathing, with a glucose of 151 but a beta-hydroxybutyrate of 4.8 mmol/L drawn at 18:41 on 3/26. Home diabetes medications are dapagliflozin 10 mg daily, metformin 500 mg twice daily (held), dulaglutide 0.5 mg weekly (continued) and insulin glargine 10 units nightly (continued). Allergies: NKDA. Other home medications are lisinopril, which continues, and hydrochlorothiazide, which is held.

**Course.** The IV insulin infusion per DKA protocol ran from 19:30 on 3/26 until it was stopped at 09:00 today. Subcutaneous insulin was started before the infusion was stopped so that there would be an overlap in basal coverage.

**Assessment and plan**

1. Euglycemic DKA is consistent with an SGLT2 inhibitor effect in a patient who also uses basal insulin. We recommend a basal insulin dose adjustment: <ref id="sc_glargine">insulin glargine 17 units subcutaneously daily, started at 07:00 today</ref>.
2. <ref id="med_dapagliflozin">Dapagliflozin: recommend against restarting at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Please review the patient's understanding of ketone warning symptoms before discharge, including nausea, abdominal pain and fast breathing, and when to return to the ED.

We will follow along with you while the patient is in hospital. Thank you for this consultation.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6159491",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-03-26T23:20:00Z",
    "admitted": "2024-03-27T04:52:00Z"
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
    "accession": "L24086-0985",
    "collected": "2024-03-26T23:41:00Z",
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
    "started": "2024-03-27T00:30:00Z",
    "stopped": "2024-03-27T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "17 units daily",
    "started": "2024-03-27T12:00:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
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
  },
  "med_sertraline": {
    "type": "home_med",
    "drug_name": "sertraline 100 mg tablet",
    "rxnorm_ingredient": "36437",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
