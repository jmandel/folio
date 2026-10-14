---
folio: "0.1"
id: "01JA0ZGCX0M0G4Z22C0N8JXCSJ"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00956732"
effective: "2024-10-12T16:21:00Z"
recorded: "2024-10-12T18:23:00Z"
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

**Reason for consultation:** euglycemic diabetic ketoacidosis in a patient taking an SGLT2 inhibitor.

**History.** I was asked to see this patient on hospital day 3. The patient presented with a high anion gap acidosis and a near-normal glucose, with beta-hydroxybutyrate 6.9 mmol/L at 21:35 on admission. No known drug allergies. Home medications are empagliflozin 10 mg daily, metformin 1000 mg twice daily (held), lisinopril 20 mg daily (held) and atorvastatin 40 mg nightly (continued).

**Hospital course.** The insulin infusion per DKA protocol ran from 22:30 on 10/10 and was stopped at 09:00 today. Subcutaneous basal insulin was begun at 07:00 so that it would overlap the infusion before it came off.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>, now resolving. The gap has closed on treatment and the patient is eating.
2. Basal insulin: <ref id="sc_glargine">insulin glargine 17 units subcutaneously daily, started at 07:00 today</ref>. Continue and adjust to glucose readings.
3. SGLT2 inhibitor: <ref id="med_empagliflozin">empagliflozin remains held, and I recommend against restarting it at discharge</ref>. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
4. Other home medications are being managed by the primary team.

Thank you for this consultation. We will continue to follow while the patient is in the hospital.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6746458",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2024-10-11T02:20:00Z",
    "admitted": "2024-10-11T07:23:00Z"
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
    "accession": "L24284-6080",
    "collected": "2024-10-11T02:35:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.9",
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
    "started": "2024-10-11T03:30:00Z",
    "stopped": "2024-10-12T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "17 units daily",
    "started": "2024-10-12T12:00:00Z"
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
  "med_lisinopril": {
    "type": "home_med",
    "drug_name": "lisinopril 20 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "20 mg",
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
