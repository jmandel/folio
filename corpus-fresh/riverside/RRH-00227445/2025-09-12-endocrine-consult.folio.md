---
folio: "0.1"
id: "01K4ZH02P05DRM1GGXMBB9M5FR"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00227445"
effective: "2025-09-12T15:46:00Z"
recorded: "2025-09-12T17:54:00Z"
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

**History.** I was asked to see this patient the morning after admission. They presented on 9/11 with several days of poor oral intake and illness, and were found to be acidotic with a glucose of 186. Beta-hydroxybutyrate was 6.3 at 15:24. No known drug allergies. They were started on the insulin infusion per DKA protocol at 16:15 on 9/11, and it was stopped at 09:00 today after the gap closed.

**Medications.** At home they take <ref id="med_empagliflozin">empagliflozin 10 mg daily, now held; I recommend against restarting it at discharge</ref>. Metformin and hydrochlorothiazide are held. Lisinopril, levothyroxine and their other daily medication are continued.

**Exam.** Comfortable and alert, speaking in full sentences. Breathing is now unlabored. Abdomen is soft and nontender.

**Assessment and plan**

1. <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. The acidosis has resolved on treatment. To bridge the stop of the IV insulin, <ref id="sc_glargine">insulin glargine 11 units subcutaneously daily was started at 07:00</ref>, overlapping with the infusion. Continue until the team is sure they are eating normally, then reassess the need for basal insulin.
2. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Before discharge, I would like the patient taught how to recognize early ketoacidosis, including nausea, vomiting and fast breathing during illness, and to seek care promptly even if sugars look normal.

Thank you for this consult. We will continue to follow while they are in the hospital.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6926554",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-09-11T20:05:00Z",
    "admitted": "2025-09-12T00:02:00Z"
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
    "accession": "L25254-9501",
    "collected": "2025-09-11T20:24:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.3",
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
    "started": "2025-09-11T21:15:00Z",
    "stopped": "2025-09-12T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "11 units daily",
    "started": "2025-09-12T12:00:00Z"
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
  "med_escitalopram": {
    "type": "home_med",
    "drug_name": "escitalopram 10 mg tablet",
    "rxnorm_ingredient": "321988",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
    "status": "continue"
  },
  "med_levothyroxine": {
    "type": "home_med",
    "drug_name": "levothyroxine 75 mg tablet",
    "rxnorm_ingredient": "10582",
    "dose_text": "75 mcg",
    "sig": "1 tab PO daily",
    "status": "continue"
  }
}
```
