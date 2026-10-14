---
folio: "0.1"
id: "01K3VM2AS0BMCPZNXZMGJHBCQF"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00773035"
effective: "2025-08-29T17:58:00Z"
recorded: "2025-08-29T19:15:00Z"
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

**Reason for consultation:** euglycemic ketoacidosis in a patient taking an SGLT2 inhibitor.

**History.** Thank you for asking us to see this patient. They were admitted on the night of 8/27 with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. Beta-hydroxybutyrate on arrival was 4.6 mmol/L, drawn at 21:51. The insulin infusion per DKA protocol ran from 22:30 on 8/27 until it was stopped at 09:00 today. Allergy list: NKDA.

**Medications.** At home the patient takes <ref id="med_dapagliflozin">dapagliflozin 10 mg daily</ref>, which is on hold, with metformin 500 mg twice daily (held), glipizide 5 mg daily (continued), losartan 100 mg daily (held) and rosuvastatin 20 mg nightly (continued).

**Exam.** The patient is sitting up, comfortable and eating. No distress, breathing is unlabored, and the abdomen is soft.

**Assessment and plan**

1. The patient is eating and the infusion has been stopped. The bridge to subcutaneous insulin was <ref id="sc_glargine">insulin glargine 17 units subcutaneously daily, started at 07:00 today</ref>. Continue it, and the primary team can adjust the dose against fingerstick glucoses.
2. SGLT2 inhibitor: dapagliflozin should not be restarted at discharge. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. The patient should be told plainly why this drug caused the problem, and that glucose can look near normal during ketoacidosis. Please review this with them before they leave.
4. We are glad to see the patient in clinic after discharge if the primary care physician wishes.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6576633",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-08-28T02:20:00Z",
    "admitted": "2025-08-28T08:15:00Z"
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
    "accession": "L25239-4512",
    "collected": "2025-08-28T02:51:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "4.6",
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
    "started": "2025-08-28T03:30:00Z",
    "stopped": "2025-08-29T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "17 units daily",
    "started": "2025-08-29T12:00:00Z"
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
    "status": "held"
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
