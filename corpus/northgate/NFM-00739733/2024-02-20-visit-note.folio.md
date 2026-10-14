---
folio: "0.1"
id: "01HQ4R4PV0RJV71T9XANRJHTX1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00739733"
effective: "2024-02-20T14:30:00-06:00"
recorded: "2024-02-20T20:33:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Feels well, no complaints today.
BP 121/74, pulse 73, wt 183 lb.
eGFR 84, K 3.9 today. LDL 105 mg/dL.
Reviewed history with pt, labs reviewed with pt.
RTC 12 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022047",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
