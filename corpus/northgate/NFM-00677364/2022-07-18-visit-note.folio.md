---
folio: "0.1"
id: "01G899GZM0P2AHAJ93T2QVD56Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00677364"
effective: "2022-07-18T11:10:00-05:00"
recorded: "2022-07-18T13:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

metformin: dose changed to 1000 mg twice daily today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071825",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071825",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
