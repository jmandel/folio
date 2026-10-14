# Feedback from an independent prose check

A separate reader looked only at the narrative text (with its ref spans) of some items from other patients of this
source, wrote down the facts each narrative asserts, and compared them with what your mapper returned for that patient
as of the item's date. 8 discrepancies are listed below, each with the item it came from (full Markdown).
The reader can be wrong (narratives mention plans, other organizations' decisions, or round numbers); the schema is
the authority. For each one, decide whether your mapper misreads the data and fix the mapper where it does.

## Patient NFM-00423020, as of 2021-07-05: value

- Narrative says (item 01F9VKKRG08KHJ02WQCEVSE1VM, ref `prob_1`): {"view":"labs","analyte":"egfr","value":49,"date":"2020-08-10","ref":"prob_1"}
- Quote: "eGFR 49 on 8/10/20"
- Your mapper: [{"analyte":"egfr","value":47,"unit":"mL/min/1.73m2","collected":"2020-08-10T07:46:00-05:00","status":"final","evidence":[{"item_id":"01EFCCQHH0TY1YQKHA9M4PTG45","entry_id":"egfr_naa"}],"egfr_equation":"ckd-epi-2009","loinc":"48642-3"}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01F9VKKRG08KHJ02WQCEVSE1VM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00423020"
effective: "2021-07-05"
recorded: "2021-07-05T10:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">CKD stage 3a. eGFR 49 on 8/10/20 and again today, UACR 76 mg/g today.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12915",
    "action": "add",
    "description": "Chronic kidney disease stage 3a",
    "icd10cm": "N18.31",
    "snomed": "700378005",
    "onset": { "date": "2021-07-05", "precision": "day" },
    "visit_id": "V-2021-070535"
  }
}
```
````
</details>

## Patient NFM-00423020, as of 2021-07-05: value

- Narrative says (item 01F9VKKRG08KHJ02WQCEVSE1VM, ref `prob_1`): {"view":"labs","analyte":"egfr","value":49,"date":"2021-07-05","ref":"prob_1"}
- Quote: "and again today"
- Your mapper: [{"analyte":"egfr","value":46,"unit":"mL/min/1.73m2","collected":"2021-07-05T07:18:00-05:00","status":"final","evidence":[{"item_id":"01F9VH50Z0SWK8G245ZCZH6SR8","entry_id":"egfr_naa"}],"egfr_equation":"ckd-epi-2009","loinc":"48642-3"}]

## Patient NFM-00448962, as of 2019-07-10: missing

- Narrative says (item 01DFE9WYKG0T6QBC06JPY2WRJ8, ref `med_1`): {"view":"labs","analyte":"a1c","value":8.1,"date":"2019-07-10","ref":"med_1"}
- Quote: "A1c 8.1."
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01DFE9WYKG0T6QBC06JPY2WRJ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00448962"
effective: "2019-07-10T11:01:00-05:00"
recorded: "2019-07-10T11:01:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.1. Metformin up to 1000 mg BID.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-25653",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.1",
    "visit_id": "V-2019-071025"
  }
}
```
````
</details>

## Patient NFM-00371731, as of 2025-08-22: value

- Narrative says (item 01K394FDQ0ZV2Q08MZ0YWN2V31, ref `referral`): {"view":"labs","analyte":"egfr","value":57,"ref":"referral"}
- Quote: "Most recent eGFR 57"
- Your mapper: [{"analyte":"egfr","value":56,"unit":"mL/min/1.73m2","collected":"2025-08-22T07:35:00-05:00","status":"final","evidence":[{"item_id":"01K39319509B63A8QR7GA4D23P","entry_id":"egfr"}],"egfr_equation":"ckd-epi-2021"}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01K394FDQ0ZV2Q08MZ0YWN2V31"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00371731"
effective: "2025-08-22T09:55:00-05:00"
recorded: "2025-08-22T09:56:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Dear Colleague,

Thank you for seeing this pt with CKD stage 3a, type 2 diabetes and essential hypertension. <ref id="referral">Most recent eGFR 57 and UACR 299 mg/g; please evaluate and manage CKD.</ref>

BP has been in range at recent visits and A1c is stable. Labs and medication list are available in our record. Please call with any questions.

Thank you for your help with this pt's care.

```json payload
{
  "referral": {
    "type": "referral_event",
    "referral_id": "RF-2025-0945",
    "action": "created",
    "to": { "org": "Lakeview Kidney Care", "specialty": "Nephrology" },
    "question": "eGFR 57, UACR 299 mg/g: CKD evaluation and management",
    "urgency": "routine"
  },
  "dx_1": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0945",
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease stage 3a"
  },
  "dx_2": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0945",
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus"
  },
  "dx_3": {
    "type": "referral_dx",
    "referral_id": "RF-2025-0945",
    "icd10cm": "I10",
    "display": "Essential hypertension"
  }
}
```
````
</details>

## Patient NFM-00371731, as of 2025-08-22: missing

- Narrative says (item 01K394FDQ0ZV2Q08MZ0YWN2V31, ref `referral`): {"view":"labs","analyte":"uacr","value":299,"ref":"referral"}
- Quote: "UACR 299 mg/g"
- Your mapper: no matching row

## Patient NFM-00072209, as of 2020-04-28: missing

- Narrative says (item 01E70F8D6GH09AZV8S55GEB9C7, ref `med_1`): {"view":"labs","analyte":"a1c","value":8.4,"date":"2020-04-28","ref":"med_1"}
- Quote: "A1c 8.4."
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01E70F8D6GH09AZV8S55GEB9C7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2020-04-28T08:22:00-05:00"
recorded: "2020-04-28T08:22:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.4. Start dulaglutide 0.5 mg weekly.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10085",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dulaglutide 1.5 MG/0.5 ML Pen Injector" },
    "dose": { "value": 0.5, "unit": "mg" },
    "frequency": "OTHER",
    "sig": "Inject 0.5 mg under the skin once weekly",
    "reason_text": "A1c 8.4",
    "visit_id": "V-2020-042866"
  }
}
```
````
</details>

## Patient NFM-00719869, as of 2025-12-24: missing

- Narrative says (item 01KD8MC19GJ895C73Z4VARKA36, ref `med_1`): {"view":"labs","analyte":"egfr","value":45,"date":"2025-12-24","ref":"med_1"}
- Quote: "eGFR 45."
- Your mapper: no matching row

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01KD8MC19GJ895C73Z4VARKA36"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00719869"
effective: "2025-12-24T10:51:00-06:00"
recorded: "2025-12-24T10:51:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 45. Metformin down to 500 mg BID.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-48070",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 45",
    "visit_id": "V-2025-122498"
  }
}
```
````
</details>

## Patient NFM-00165827, as of 2025-06-17: value

- Narrative says (item 01JXZ1PDGG6PFHFSCXWZZGYWKN, ref `med_1`): {"view":"labs","analyte":"egfr","value":44,"date":"2025-06-17","ref":"med_1"}
- Quote: "eGFR 44 today."
- Your mapper: [{"analyte":"egfr","value":43,"unit":"mL/min/1.73m2","collected":"2025-06-17T07:22:00-05:00","status":"final","evidence":[{"item_id":"01JXZ7Q7E01JJX5Z5KAENQ3FBG","entry_id":"egfr"}],"egfr_equation":"ckd-epi-2021"}]

<details><summary>item</summary>

````markdown
---
folio: "0.1"
id: "01JXZ1PDGG6PFHFSCXWZZGYWKN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00165827"
effective: "2025-06-17T08:36:00-05:00"
recorded: "2025-06-17T08:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 44 today. Metformin changed to 500 mg BID.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-11250",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 44",
    "visit_id": "V-2025-061746"
  }
}
```
````
</details>
