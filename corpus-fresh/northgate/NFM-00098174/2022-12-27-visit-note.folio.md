---
folio: "0.1"
id: "01GNAZHCG0TWEQB4FCDM5AH4ZR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00098174"
effective: "2022-12-27T15:45:00-06:00"
recorded: "2022-12-27T17:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.

BP 144/79, repeat 141/75, pulse 79, wt 193 lb.

Labs today: eGFR 60, K 4.3, A1c 7.5%.

BP a bit up today. Will keep an eye on it. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122776",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122776",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-122776",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
