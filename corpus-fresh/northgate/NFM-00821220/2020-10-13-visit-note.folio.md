---
folio: "0.1"
id: "01EMHW4NH0PT5YA6JWXZR5RM1N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821220"
effective: "2020-10-13T10:40:00-05:00"
recorded: "2020-10-13T15:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well.
BP 149/80, pulse 88, wt 175 lb.
Labs 10/10: eGFR 96, K 4.3, UACR 65 mg/g, A1c 8.1%.
A1c up, metformin dose changed to 1000 mg twice daily today. BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-101373",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-101373",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-101373",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
