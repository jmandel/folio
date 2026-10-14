---
folio: "0.1"
id: "01H61ZQEQ0YR9H9JPRQDGM7KSS"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00760797"
effective: "2023-07-23T16:23:00Z"
recorded: "2023-07-23T18:21:00Z"
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

**Reason for consult:** euglycemic ketoacidosis in a patient taking an SGLT2 inhibitor.

**History.** I was asked to see this man with type 2 diabetes, hypertension and hyperlipidemia, admitted with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. He had been taking <ref id="med_empagliflozin">empagliflozin 10 mg daily; I recommend against restarting it at discharge</ref>. He has had no prior episodes of ketoacidosis that he can recall. Allergies: NKDA.

**Results.** Beta-hydroxybutyrate on admission was 7.2 mmol/L, drawn 23:15 on 7/21. The insulin infusion per DKA protocol ran from 23:58 on 7/21 until 09:00 today.

**Assessment and plan**

1. Euglycemic DKA is resolving on treatment. Basal insulin has been started: <ref id="sc_glargine">insulin glargine 11 units subcutaneously daily, begun at 07:00 today</ref>. This overlaps with the infusion before it is stopped, which avoids rebound ketosis.
2. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Metformin and hydrochlorothiazide remain on hold per the primary team. Losartan and atorvastatin continue.
4. We will follow along and help with the outpatient diabetes regimen before discharge.

Thank you for this consult.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6815248",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2023-07-22T03:48:00Z",
    "admitted": "2023-07-22T07:58:00Z"
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
    "accession": "L23202-1828",
    "collected": "2023-07-22T04:15:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "7.2",
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
    "started": "2023-07-22T04:58:00Z",
    "stopped": "2023-07-23T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "11 units daily",
    "started": "2023-07-23T12:00:00Z"
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
