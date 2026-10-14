---
folio: "0.1"
id: "01FTY8A010XSVKQ4ZK0VTXPWW7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2022-02-02T11:10:00-06:00"
recorded: "2022-02-02T16:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Pt doing well.
BP 124/74, pulse 62, wt 224 lb.
Labs today: eGFR 72, K 3.9, LDL 71 mg/dL.
Discussed results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-020265",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
