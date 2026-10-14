---
folio: "0.1"
id: "01JBF6YAA0VG0Z4D7PXC1ZWR71"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00367985"
effective: "2024-10-30T08:10:00-05:00"
recorded: "2024-10-30T12:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.

BP 139/85, pulse 73, wt 234 lb.

Labs 10/26: eGFR 91, K 4.5, UACR 56 mg/g, A1c 6.8%. Reviewed with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-103028",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-103028",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-103028",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
