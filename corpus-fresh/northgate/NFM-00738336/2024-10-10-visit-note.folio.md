---
folio: "0.1"
id: "01J9W5T630Q7KFCP3E5NYYE4ZS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738336"
effective: "2024-10-10T12:40:00-05:00"
recorded: "2024-10-10T16:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 135/80, pulse 72, wt 217 lb.
Labs 10/6: eGFR 68, K 4.3, UACR 8 mg/g, A1c 7.5%, LDL 67 mg/dL.
Wt up a few lb, discussed diet. Pt feels well.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101054",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-101054",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-101054",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
