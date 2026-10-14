---
folio: "0.1"
id: "01JJAKC830WW33ATFB2Y0MDN6N"
issuer: "did:web:riverside-regional.example"
patient: "RRH-00656053"
effective: "2025-01-23T20:57:00Z"
recorded: "2025-01-23T22:09:00Z"
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

**History.** I was asked to see the patient on hospital day 2. The patient presented with <ref id="dx_dka">euglycemic DKA, SGLT2 inhibitor-associated</ref>, with beta-hydroxybutyrate 5.2 mmol/L on the 00:01 draw on 1/22. The insulin infusion per DKA protocol ran from 00:44 on 1/22 until 09:00 today. Allergy: lisinopril (angioedema). Home metformin and losartan are being held, and amlodipine continues.

**Assessment.** The picture is typical of ketoacidosis triggered by an SGLT2 inhibitor during a period of poor intake, and it has responded as expected to insulin and fluids. The patient has been eating, and the infusion has now been stopped.

**Recommendations**

1. <ref id="sc_glargine">Insulin glargine 14 units subcutaneously daily, started 07:00 on 1/23</ref>, serves as the basal insulin now that the infusion is off.
2. <ref id="med_dapagliflozin">Dapagliflozin is held; I recommend against restarting it at discharge.</ref> Endocrinology advises against restarting any SGLT2 inhibitor; a future re-challenge would need written sick-day guidance first.
3. The patient should be told plainly why the drug is being stopped and what the warning symptoms of ketoacidosis are, including nausea, vomiting, abdominal pain and fast breathing, even when blood sugars look normal.
4. Outpatient follow-up with primary care to review the diabetes regimen.

Thank you for this consultation. We will follow along while the patient remains in the hospital.

```json payload
{
  "enc": {
    "type": "encounter",
    "encounter_id": "RRH-ENC-6374607",
    "document_kind": "consult",
    "class": "inpatient",
    "service": "Endocrinology",
    "arrived": "2025-01-22T05:34:00Z",
    "admitted": "2025-01-22T09:43:00Z"
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
    "accession": "L25022-3735",
    "collected": "2025-01-22T06:01:00Z",
    "specimen": "serum",
    "status": "final",
    "value": "5.2",
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
    "started": "2025-01-22T06:44:00Z",
    "stopped": "2025-01-23T15:00:00Z"
  },
  "sc_glargine": {
    "type": "inpatient_med",
    "drug_name": "insulin glargine",
    "rxnorm_ingredient": "274783",
    "route": "SubQ",
    "dose_text": "14 units daily",
    "started": "2025-01-23T13:00:00Z"
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
