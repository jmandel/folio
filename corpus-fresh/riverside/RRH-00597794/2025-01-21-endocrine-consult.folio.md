---
folio: "0.1"
id: "01JJ53N2P0PVMMR9R9TS9R2WSJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00597794"
effective: "2025-01-21T17:27:00Z"
recorded: "2025-01-21T18:58:00Z"
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

**History.** The patient is a woman with type 2 diabetes who was admitted on 1/20 after several days of vomiting and minimal intake. Her initial beta-hydroxybutyrate was 6.2 mmol/L. She was treated with an IV insulin infusion per DKA protocol (0.1 units/kg/h), started 1/20 at 15:15 and stopped 1/21 at 09:00 once her gap had closed. She is allergic to lisinopril (angioedema). Current home medications include metformin (held), losartan and amlodipine (continued) and chlorthalidone (held).

**Exam.** She is comfortable this morning, eating, and breathing normally. Mucous membranes are moist.

**Assessment**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, resolved biochemically. The picture of near-normal glucose with ketoacidosis is typical of this drug class when intake falls during an acute illness.
2. Basal insulin: <ref id="sc_glargine">insulin glargine 12 units subcutaneously daily, started 1/21 at 07:00</ref>, overlapped with the infusion before it was stopped. Continue it for now.
3. <ref id="med_dapagliflozin">Dapagliflozin is held and I recommend against restarting it at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.

**Plan.** We will follow while she is here and will see her again before discharge. Outpatient follow-up with her primary care physician to review her diabetes regimen.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6551517",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-01-20T20:05:00Z",
    "admitted": "2025-01-20T23:54:00Z"
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
    "accession": "L25020-7330",
    "collected": "2025-01-20T20:20:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.2",
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
    "started": "2025-01-20T21:15:00Z",
    "stopped": "2025-01-21T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "12 units daily",
    "started": "2025-01-21T13:00:00Z"
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
