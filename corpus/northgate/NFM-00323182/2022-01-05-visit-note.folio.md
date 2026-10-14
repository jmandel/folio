---
folio: "0.1"
id: "01FRNJBEP021EN1PNMKRT4G7NP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00323182"
effective: "2022-01-05T09:10:00-06:00"
recorded: "2022-01-05T10:50:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 146/90, repeat 144/90, pulse 75, wt 209 lb.
Labs 1/2: eGFR 97, K 4.6, UACR 67 mg/g, A1c 7.7%, LDL 123 mg/dL.
Will recheck BP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-010515",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-010515",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
