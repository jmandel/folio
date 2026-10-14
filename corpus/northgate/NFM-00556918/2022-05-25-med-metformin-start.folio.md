---
folio: "0.1"
id: "01G3Y9TCEG0PMPJYGW54373YV4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2022-05-25T14:06:00-05:00"
recorded: "2022-05-25T14:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27850",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "visit_id": "V-2022-052513"
  }
}
```
