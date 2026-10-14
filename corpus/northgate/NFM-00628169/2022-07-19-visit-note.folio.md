---
folio: "0.1"
id: "01G8CDTTF03WA3JRY2HK2S6X1Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00628169"
effective: "2022-07-19T13:30:00-05:00"
recorded: "2022-07-19T18:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: dose changed to 500 mg twice daily today (eGFR 45)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071957",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071957",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
