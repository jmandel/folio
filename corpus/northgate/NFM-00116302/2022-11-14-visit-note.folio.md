---
folio: "0.1"
id: "01GHW3JV105XS9HZQBXQNAVWAD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2022-11-14T11:50:00-06:00"
recorded: "2022-11-14T16:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 121/78, pulse 71, wt 242 lb.
Labs today: eGFR 61, K 4.2, UACR 27 mg/g, A1c 8.1%, LDL 63 mg/dL.
A1c 8.1, so insulin glargine dose changed to 14 units at bedtime today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111494",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111494",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
