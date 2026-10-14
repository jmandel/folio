---
folio: "0.1"
id: "01HCDG596066BS8PFFNVMQW7D4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484397"
effective: "2023-10-10T12:15:00-05:00"
recorded: "2023-10-10T14:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Doing well.
BP 129/73, pulse 73, wt 160 lb.
Labs 10/7: eGFR 77, K 4.1, LDL 105 mg/dL.
BP at goal today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101026",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101026",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
