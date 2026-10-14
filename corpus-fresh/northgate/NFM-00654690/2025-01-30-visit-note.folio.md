---
folio: "0.1"
id: "01JJWBEYV0NDMM1ECF8ZFZTWAE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2025-01-30T09:20:00-06:00"
recorded: "2025-01-30T13:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 137/82, pulse 73, wt 244 lb.
Labs 1/25: eGFR 86, K 4.4, UACR 519 mg/g, A1c 7.4%, LDL 171 mg/dL.
No new complaints today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-013025",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-013025",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
