---
folio: "0.1"
id: "01JQPVWCS0A3EX7B826FMY9KS7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00184341"
effective: "2025-03-31T09:15:00-05:00"
recorded: "2025-03-31T14:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing OK overall.
BP 151/85, pulse 78, wt 214 lb.
eGFR 87, K 4.5, LDL 132 mg/dL today.
BP above goal, amlodipine 5 mg daily started today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-033184",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-033184",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-033184",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
