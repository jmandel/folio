---
folio: "0.1"
id: "01HCX32830HPK3K80X1N1G67YD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2023-10-16T13:45:00-05:00"
recorded: "2023-10-16T15:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new symptoms.
BP 138/81, pulse 74, wt 237 lb.
eGFR 90 on 10/14.
Reviewed results with pt. Encouraged exercise.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101689",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101689",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
