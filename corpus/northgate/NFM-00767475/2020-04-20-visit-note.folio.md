---
folio: "0.1"
id: "01E6CZGMA0EJCR8PEAK8VDTKJK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00767475"
effective: "2020-04-20T13:50:00-05:00"
recorded: "2020-04-20T18:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-042073",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-042073",
    "rank": 1,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
