---
folio: "0.1"
id: "01JARCAVQGC2SZ574V1ASM0R60"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00577826"
effective: "2024-10-21T15:29:00-05:00"
recorded: "2024-10-21T15:29:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan held today for vomiting and poor oral intake. Review 10/28.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-39312",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979492" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2024-10-28"
  }
}
```
