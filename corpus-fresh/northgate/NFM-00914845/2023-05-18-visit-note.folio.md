---
folio: "0.1"
id: "01H0RS7X40T818CFGKDAGCGD1F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00914845"
effective: "2023-05-18T15:00:00-05:00"
recorded: "2023-05-18T20:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Pt feels well.
BP 136/83, pulse 74, wt 302 lb.
Labs 5/15: eGFR 87, LDL 152 mg/dL. Went over results with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051875",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
