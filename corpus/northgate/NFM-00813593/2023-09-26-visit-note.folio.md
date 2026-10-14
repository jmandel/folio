---
folio: "0.1"
id: "01HB9KB6F0TDTGJ2M6PEW0FNT3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2023-09-26T11:50:00-05:00"
recorded: "2023-09-26T15:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: dose changed to 1000 mg twice daily today (A1c 8.5)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092649",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092649",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
