---
folio: "0.1"
id: "01JF8XY6W0SMSSYEPMJQKHSVV3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2024-12-16T15:40:00-06:00"
recorded: "2024-12-16T17:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 135/77, pulse 87, wt 197 lb.
Today: eGFR 55, K 4.2, UACR 431 mg/g, A1c 7.9%.
A1c a bit higher, eGFR slowly down. Will keep following.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121659",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121659",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-121659",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
