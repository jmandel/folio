---
folio: "0.1"
id: "01H55WQRA084XFFYAZPDHQWQ0F"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00556782"
effective: "2023-07-12T18:29:00Z"
recorded: "2023-07-12T20:30:00Z"
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

**Reason for consultation:** euglycemic ketoacidosis in a patient taking an SGLT2 inhibitor.

**History.** The patient is a man with type 2 diabetes admitted two days ago with acidosis and a glucose of 229. Initial beta-hydroxybutyrate was 7.0 mmol/L. He has no known drug allergies. His home <ref id="med_empagliflozin">empagliflozin is held</ref>. Metformin and losartan are also on hold.

**Hospital course.** He was treated with an insulin infusion per DKA protocol from 22:15 on 7/10 until 09:00 today, when it was stopped. <ref id="sc_glargine">Insulin glargine 14 units subcutaneously daily was started at 07:00 on 7/12</ref> and continues, so that basal insulin was on board before the infusion came off.

**Assessment.** <ref id="dx_dka">Euglycemic DKA, SGLT2 inhibitor-associated</ref>. The picture of a modest glucose with a high ketone level and a wide anion gap is typical for this drug class, especially with a period of poor intake. The gap has closed and he is clinically improved.

**Recommendations**

1. Do not restart empagliflozin at discharge.
2. Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. Continue the current basal insulin while he is in the hospital and monitor fingerstick glucose before meals and at bedtime.
4. Reinforce with the patient that nausea, vomiting, abdominal pain or fast breathing should prompt prompt medical attention even when glucose readings look reassuring.
5. Outpatient follow-up with primary care after discharge; we are glad to see him in clinic if wanted.

Thank you for involving us in his care.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6760052",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2023-07-11T02:05:00Z",
    "admitted": "2023-07-11T05:53:00Z"
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
    "accession": "L23191-7119",
    "collected": "2023-07-11T02:34:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "7.0",
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
    "started": "2023-07-11T03:15:00Z",
    "stopped": "2023-07-12T14:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2023-07-12T12:00:00Z"
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
  "med_losartan": {
    "type": "home_med",
    "drug_name": "losartan 50 mg tablet",
    "rxnorm_ingredient": "52175",
    "dose_text": "50 mg",
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
  }
}
```
