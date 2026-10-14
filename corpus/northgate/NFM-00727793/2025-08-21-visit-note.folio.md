---
folio: "0.1"
id: "01K3728H10TFXG8AZS353NV8GW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2025-08-21T13:00:00-05:00"
recorded: "2025-08-21T14:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no complaints.

BP 117/73, pulse 75, wt 170 lb.

Labs 8/16: eGFR 90, K 5, UACR 171 mg/g, A1c 7%.

Routine exam unremarkable. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082127",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-082127",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-082127",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
