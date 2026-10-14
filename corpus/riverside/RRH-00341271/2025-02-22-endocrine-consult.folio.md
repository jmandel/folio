---
folio: "0.1"
id: "01JMQSW1803R1PKKTF69HGP7ZM"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00341271"
effective: "2025-02-22T20:06:00Z"
recorded: "2025-02-22T21:44:00Z"
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

**Reason for consultation:** euglycemic diabetic ketoacidosis in a patient with type 2 diabetes.

**History.** The patient was admitted with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. Beta-hydroxybutyrate was 7.1 mmol/L on the 2/20 21:36 draw. The IV insulin infusion ran from 2/20 22:15 until 09:00 today, and <ref id="sc_glargine">insulin glargine 18 units subcutaneously daily was started at 07:00 on 2/22</ref> so that the transition off the infusion overlapped with basal insulin. Allergies: NKDA.

**Other medications.** Metformin is held, chlorthalidone is held, and glipizide, losartan and atorvastatin are continued.

**Assessment and plan**

1. The ketoacidosis has responded to treatment and the patient is now on subcutaneous basal insulin.
2. <ref id="med_empagliflozin">Empagliflozin is held, and I recommend against restarting it at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Primary care follow-up should review the diabetes regimen after discharge. We are glad to see the patient in clinic if helpful.

Thank you for involving us in this patient's care.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6857323",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-02-21T03:05:00Z",
    "admitted": "2025-02-21T09:16:00Z"
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
    "accession": "L25051-8560",
    "collected": "2025-02-21T03:36:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "7.1",
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
    "started": "2025-02-21T04:15:00Z",
    "stopped": "2025-02-22T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "18 units daily",
    "started": "2025-02-22T13:00:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_chlorthalidone": {
    "type": "home_med",
    "drug_name": "chlorthalidone 25 mg tablet",
    "rxnorm_ingredient": "2409",
    "dose_text": "12.5 mg",
    "sig": "1/2 tab PO daily",
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
