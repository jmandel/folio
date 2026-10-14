---
folio: "0.1"
id: "01JA9GEH30VXZMCEGVC4DP31D0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2024-10-15T15:10:00-05:00"
recorded: "2024-10-15T20:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.

BP 144/90, repeat 139/90, pulse 64, wt 212 lb.
Labs 10/12: eGFR 58, K 4.5, A1c 7.1%.

BP running above goal on both readings. Will keep an eye on it. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101574",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101574",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-101574",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
