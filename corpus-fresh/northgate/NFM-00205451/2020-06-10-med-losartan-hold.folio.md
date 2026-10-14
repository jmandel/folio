---
folio: "0.1"
id: "01EAFCBJHGPEMBKH24BFNTDRZT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2020-06-10T10:07:00-05:00"
recorded: "2020-06-10T10:07:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan held today, vomiting and poor oral intake.</ref> Review 6/17.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-28376",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2020-06-17"
  }
}
```
