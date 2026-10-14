---
folio: "0.1"
id: "01KP9S3M1075VCTSN42DZ5SSY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00020574"
effective: "2026-04-15T13:30:00-05:00"
recorded: "2026-04-15T18:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 144/87, repeat 140/87, pulse 79, wt 213 lb.
eGFR 80, K 4.3, UACR 8 mg/g, A1c 7.3%, LDL 138 mg/dL today.
BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-041537",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-041537",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-041537",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
