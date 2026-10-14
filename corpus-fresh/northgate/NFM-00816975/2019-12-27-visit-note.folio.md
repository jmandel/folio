---
folio: "0.1"
id: "01DX4V0B00GZKF47HF831Z703N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2019-12-27T11:15:00-06:00"
recorded: "2019-12-27T17:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 142/82, repeat 135/82, pulse 76, wt 225 lb.
eGFR 70, K 4.1, A1c 7.8% today.
BP above goal, chlorthalidone started 12.5 mg daily today.
Pt to watch for dizziness. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-122743",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-122743",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-122743",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
