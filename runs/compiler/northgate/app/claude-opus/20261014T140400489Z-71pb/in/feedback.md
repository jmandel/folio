# Feedback from an independent prose check

A separate reader looked only at the narrative text (with its ref spans) of some items from other patients of this
source, wrote down the facts each narrative asserts, and compared them with what your mapper returned for that patient
as of the item's date. 3 discrepancies are listed below, each with the item it came from (full Markdown).
The reader can be wrong (narratives mention plans, other organizations' decisions, or round numbers); the schema is
the authority. For each one, decide whether your mapper misreads the data and fix the mapper where it does.

## Patient NFM-00212600, as of 2025-06-17: missing

- Narrative says (item 01JXZMJNEGH7TPXBKJTFBY5B4Z, ref `med_1`): {"view":"labs","analyte":"a1c","value":8.4,"ref":"med_1"}
- Quote: "A1c 8.4"
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JXZMJNEGH7TPXBKJTFBY5B4Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2025-06-17T14:06:00-05:00"
recorded: "2025-06-17T14:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.4. Empagliflozin 10 mg daily started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-20457",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.4",
    "visit_id": "V-2025-061792"
  }
}
```
````
</details>

## Patient NFM-00165697, as of 2023-08-21: missing

- Narrative says (item 01H8CS8V00DQK8X0ZHMWT4969B, ref `referral`): {"view":"labs","analyte":"egfr","value":59,"ref":"referral"}
- Quote: "Most recent eGFR is 59"
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01H8CS8V00DQK8X0ZHMWT4969B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165697"
effective: "2023-08-21T14:30:00-05:00"
recorded: "2023-08-21T14:31:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Lakeview Kidney Care,

<ref id="referral">I am referring this patient for evaluation and management of chronic kidney disease. Most recent eGFR is 59 with UACR 311 mg/g.</ref>

The patient has chronic kidney disease stage 3a and type 2 diabetes mellitus. Both are followed here in primary care. Recent results are as above, and I am happy to send further records on request.

Thank you for seeing this patient. Please send your recommendations when you have them.

Sincerely,
Dr. Reyes

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2023-0421",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 59, UACR 311 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0421",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2023-0421",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  }
}
```
````
</details>

## Patient NFM-00165697, as of 2023-08-21: missing

- Narrative says (item 01H8CS8V00DQK8X0ZHMWT4969B, ref `referral`): {"view":"labs","analyte":"uacr","value":311,"ref":"referral"}
- Quote: "UACR 311 mg/g"
- Your mapper: no matching row
