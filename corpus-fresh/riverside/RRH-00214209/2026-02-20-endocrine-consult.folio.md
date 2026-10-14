---
folio: "0.1"
id: "01KHYGHRD0K89Q6E35N2F6PEM8"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00214209"
effective: "2026-02-20T19:42:00Z"
recorded: "2026-02-20T21:51:00Z"
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

**Reason for consultation:** euglycemic ketoacidosis on an SGLT2 inhibitor.

**History.** The patient was admitted with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>. Beta-hydroxybutyrate on arrival was 6.7 mmol/L. The insulin infusion started at 00:30 on 2/19 and was stopped at 09:00 today after the gap closed. The patient has no known drug allergies. Home medications include metformin (held), dulaglutide (continue), insulin glargine 10 units nightly, lisinopril (held) and amlodipine.

**Assessment.** Ketoacidosis occurred in the setting of an acute illness with poor intake while taking an SGLT2 inhibitor, a well-described pattern in which glucose stays near normal. The acidosis has resolved on the infusion.

**Recommendations**

1. Transition from the infusion to subcutaneous insulin. <ref id="sc_glargine">Insulin glargine 15 units daily was started at 07:00</ref>, before the infusion came off, so basal coverage overlaps.
2. <ref id="med_empagliflozin">Recommend against restarting empagliflozin at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Review sick-day rules with the patient before discharge: when to call, and not to continue stopped medicines through vomiting or poor intake.
4. We will follow along while the insulin doses are settled and are glad to see the patient in clinic afterward.

Thank you for involving us in this patient's care.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6191540",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2026-02-19T05:20:00Z",
    "admitted": "2026-02-19T10:55:00Z"
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
    "accession": "L26049-2797",
    "collected": "2026-02-19T05:44:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "6.7",
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
    "started": "2026-02-19T06:30:00Z",
    "stopped": "2026-02-20T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "15 units daily",
    "started": "2026-02-20T13:00:00Z"
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
    "drug_name": "lisinopril 10 mg tablet",
    "rxnorm_ingredient": "29046",
    "dose_text": "10 mg",
    "sig": "1 tab PO daily",
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
