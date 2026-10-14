---
folio: "0.1"
id: "01H7H76RM04SGHA9MVARW58888"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00007594"
effective: "2023-08-10T15:10:00-05:00"
recorded: "2023-08-10T21:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new symptoms.
BP 129/76, pulse 74, wt 208 lb.
eGFR 74, LDL 137 mg/dL today.
Discussed results and diet with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-081029",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
