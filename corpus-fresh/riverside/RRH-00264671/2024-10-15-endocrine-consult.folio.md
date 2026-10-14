---
folio: "0.1"
id: "01JA8JD7C0Z80DQQVR3ZGEY7NR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00264671"
effective: "2024-10-15T15:09:00Z"
recorded: "2024-10-15T17:08:00Z"
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

**Reason for consultation:** euglycemic diabetic ketoacidosis in a patient on an SGLT2 inhibitor.

**History.** I reviewed the chart and spoke with the patient. They were admitted overnight with a bicarbonate of 10 and a beta-hydroxybutyrate of 5.8 mmol/L, drawn at 18:45, with a glucose of only 220. The insulin infusion per DKA protocol ran from 19:30 until 09:00 this morning. Home medications are metformin (held), losartan (held), chlorthalidone (held), amlodipine and rosuvastatin (both continued), and <ref id="med_dapagliflozin">dapagliflozin 10 mg daily, held; I recommend against restarting it at discharge</ref>. Allergies: NKDA.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. The patient has responded to treatment, and the infusion was stopped at 09:00.
2. Basal insulin: <ref id="sc_glargine">insulin glargine 16 units subcutaneously daily, started at 07:00</ref>, so that the infusion could be stopped without a gap in coverage. Continue it for now.
3. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
4. We will follow along while the patient is in the hospital.

Thank you for this consultation.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6098736",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-10-14T23:20:00Z",
    "admitted": "2024-10-15T04:45:00Z"
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
    "accession": "L24288-7391",
    "collected": "2024-10-14T23:45:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.8",
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
    "started": "2024-10-15T00:30:00Z",
    "stopped": "2024-10-15T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "16 units daily",
    "started": "2024-10-15T12:00:00Z"
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
    "drug_name": "losartan 100 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "100 mg",
    "sig": "1 tab PO daily",
    "status": "held"
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
    "drug_name": "amlodipine 5 mg tablet",
    "rxnorm_ingredient": "17767",
    "dose_text": "5 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_rosuvastatin": {
    "type": "home_med",
    "drug_name": "rosuvastatin 20 mg tablet",
    "rxnorm_ingredient": "301542",
    "dose_text": "20 mg",
    "sig": "1 tab PO nightly",
    "status": "continue"
  }
}
```
