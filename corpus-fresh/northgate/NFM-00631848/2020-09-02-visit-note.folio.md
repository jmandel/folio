---
folio: "0.1"
id: "01EH8AMTV0FW3RHVVB67543AQE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2020-09-02T11:30:00-05:00"
recorded: "2020-09-02T16:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feels fine, no new concerns.
BP 135/78, pulse 80, wt 221 lb.
Labs 8/28: eGFR 78, LDL 98 mg/dL.
Reviewed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-090225",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-090225",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
