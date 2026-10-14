---
folio: "0.1"
id: "01JMZN7VK0TR6WXEMCV7WK2SR6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00273200"
effective: "2025-02-25T13:30:00-06:00"
recorded: "2025-02-25T16:57:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 143/81, pulse 78, wt 103 lb.
Labs 2/20: eGFR 62, K 4, UACR 10 mg/g, A1c 7.8%.
BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022566",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022566",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-022566",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
