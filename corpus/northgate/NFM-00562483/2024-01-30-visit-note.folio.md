---
folio: "0.1"
id: "01HNE9S350JW20EA1V5JJVBQ66"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00562483"
effective: "2024-01-30T14:15:00-06:00"
recorded: "2024-01-30T17:03:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No headaches or dizziness.
BP 139/83, pulse 80, wt 162 lb.
eGFR 72, K 4.3 today.
Labs stable.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-013062",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-013062",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
