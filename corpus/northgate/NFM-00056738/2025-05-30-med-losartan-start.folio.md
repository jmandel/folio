---
folio: "0.1"
id: "01JWGVB9CG9RR0VWEXZP0ZRQ0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00056738"
effective: "2025-05-30T10:00:00-05:00"
recorded: "2025-05-30T10:00:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start losartan: albuminuria.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23569",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "albuminuria"
  }
}
```
