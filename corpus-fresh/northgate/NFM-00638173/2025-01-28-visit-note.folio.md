---
folio: "0.1"
id: "01JJQT9JG0A9PC9BX8MST9TZSQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00638173"
effective: "2025-01-28T15:50:00-06:00"
recorded: "2025-01-28T19:20:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u.
BP 145/96, repeat 137/94, pulse 81, wt 246 lb.
eGFR 96, K 4.7, UACR 225 mg/g, A1c 7.5%.
BP above goal, lisinopril dose changed to 20 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012865",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012865",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
