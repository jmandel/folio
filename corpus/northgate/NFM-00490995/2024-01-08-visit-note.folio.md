---
folio: "0.1"
id: "01HKNBY4R0KJMF095WASHF4NEE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490995"
effective: "2024-01-08T12:40:00-06:00"
recorded: "2024-01-08T14:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 136/85, pulse 87, wt 205 lb.
eGFR 71, K 4.9, A1c 7.3%, LDL 118 mg/dL today.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010823",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010823",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
