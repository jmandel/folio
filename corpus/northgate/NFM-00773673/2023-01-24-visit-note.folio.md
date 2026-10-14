---
folio: "0.1"
id: "01GQJVP420FQTWMDDV6FME8G9R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2023-01-24T09:45:00-06:00"
recorded: "2023-01-24T15:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing well, no complaints.
BP 120/75, pulse 85, wt 239 lb.
Labs today: eGFR 93, K 4.2, LDL 141 mg/dL.
Reviewed results with pt, discussed diet.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-012414",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-012414",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
