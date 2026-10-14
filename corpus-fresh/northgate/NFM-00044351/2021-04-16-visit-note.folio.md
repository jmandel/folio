---
folio: "0.1"
id: "01F3E2XN80THESPCY7E37TAGFP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2021-04-16T12:50:00-05:00"
recorded: "2021-04-16T14:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 147/91, repeat 144/87. Pulse 72, wt 235 lb.

4/13 labs: eGFR 74, K 4.5, UACR 8 mg/g, A1c 7.5%.

BP above goal, losartan dose changed to 100 mg daily today.

RTC 3 mo, sooner if problems.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-041694",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-041694",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-041694",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
