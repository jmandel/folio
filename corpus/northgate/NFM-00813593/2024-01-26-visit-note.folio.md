---
folio: "0.1"
id: "01HN3VHX20HEZVMCY6PQ18Y15T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2024-01-26T12:20:00-06:00"
recorded: "2024-01-26T15:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Feels well.
BP 145/89, repeat 137/87, pulse 75, wt 222 lb.
eGFR 63, K 4.5, UACR 35 mg/g, A1c 7.7% today.
BP improved on repeat. Reviewed home readings and diet.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012686",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012686",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
