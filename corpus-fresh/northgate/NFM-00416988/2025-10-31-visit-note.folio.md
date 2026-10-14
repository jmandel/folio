---
folio: "0.1"
id: "01K8XWPWD0Y2TN4B6J0SN43PY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2025-10-31T08:30:00-05:00"
recorded: "2025-10-31T14:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.
BP 140/81, pulse 65, wt 205 lb.
Today: eGFR 89, K 4.2, UACR 8 mg/g, A1c 6.1%.
Continue current plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-103117",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-103117",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
