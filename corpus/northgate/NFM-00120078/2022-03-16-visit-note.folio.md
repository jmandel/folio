---
folio: "0.1"
id: "01FYAARRW0ZQ2CM2Q384YSDKH2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00120078"
effective: "2022-03-16T10:45:00-05:00"
recorded: "2022-03-16T16:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 132/76, pulse 65, wt 209 lb.
Labs 3/13: eGFR 73, K 4, LDL 68 mg/dL.
Discussed results with pt, no concerns today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-031636",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-031636",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
