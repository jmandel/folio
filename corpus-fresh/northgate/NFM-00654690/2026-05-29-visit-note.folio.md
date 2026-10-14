---
folio: "0.1"
id: "01KSTZVBH0DZX8TM6MN12GZD47"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2026-05-29T12:00:00-05:00"
recorded: "2026-05-29T18:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 132/79, pulse 64, wt 242 lb.
Labs today: eGFR 84, K 4.1, UACR 750 mg/g, A1c 8%, LDL 111 mg/dL.
No new complaints today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-052976",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-052976",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-052976",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
