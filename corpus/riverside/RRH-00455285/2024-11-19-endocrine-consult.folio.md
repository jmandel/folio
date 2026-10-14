---
folio: "0.1"
id: "01JD356ER0YCKBFS3HMZN799GH"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00455285"
effective: "2024-11-19T19:43:00Z"
recorded: "2024-11-19T21:28:00Z"
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

**Reason for consultation:** euglycemic ketoacidosis in a patient with type 2 diabetes on an SGLT2 inhibitor.

**History.** I was asked to see this man on hospital day 2. He presented yesterday with nausea, fatigue and fast breathing and was found to have <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>, with beta-hydroxybutyrate 5.1 on the 16:24 sample. An insulin infusion per DKA protocol was started at 17:05 and stopped at 09:00 today. He has no known drug allergies. Home medications are dapagliflozin, metformin, losartan, hydrochlorothiazide and atorvastatin.

**Exam.** He is comfortable and breathing normally at rest. Mucous membranes are moist. Abdomen is soft and non-tender. He is alert and gives a clear account.

**Assessment and plan**

1. The ketoacidosis has resolved on treatment. <ref id="sc_glargine">Insulin glargine 15 units subcutaneously daily</ref> was started at 07:00 and overlapped the infusion; continue it for now.
2. <ref id="med_dapagliflozin">Dapagliflozin: recommend against restarting at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Metformin and hydrochlorothiazide remain held per the primary team. Losartan and atorvastatin continue.
4. We will follow along and help with the outpatient diabetes regimen before discharge.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6621354",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-11-18T21:55:00Z",
    "admitted": "2024-11-19T03:00:00Z"
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
    "accession": "L24323-5730",
    "collected": "2024-11-18T22:24:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.1",
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
    "started": "2024-11-18T23:05:00Z",
    "stopped": "2024-11-19T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "15 units daily",
    "started": "2024-11-19T13:00:00Z"
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
    "drug_name": "atorvastatin 40 mg tablet",
    "rxnorm_ingredient": "83367",
    "dose_text": "40 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
