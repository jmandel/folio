---
folio: "0.1"
id: "01F8WYSN10TJZGP0AQ5K9T4NZX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2021-06-23T09:50:00-05:00"
recorded: "2021-06-23T12:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.
BP 140/90, repeat 137/88, pulse 85, wt 152 lb.
Labs 6/18: eGFR 93, K 4.4, A1c 8.3%, LDL 112.
Insulin glargine started 10 units at bedtime today for A1c 8.3. Taught pen use and fasting checks.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-062343",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-062343",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-062343",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
