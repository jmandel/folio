---
folio: "0.1"
id: "01HA8EY330EBG4Z2ND4YMFGBZ9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00098174"
effective: "2023-09-13T13:45:00-05:00"
recorded: "2023-09-13T18:45:00-05:00"
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

BP 141/83, repeat 136/80, pulse 69, wt 187 lb.

Labs 9/7: eGFR 57, K 4.5, A1c 7.2%, LDL 82 mg/dL.

BP above goal, lisinopril dose changed to 20 mg daily today. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091325",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-091325",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-091325",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
