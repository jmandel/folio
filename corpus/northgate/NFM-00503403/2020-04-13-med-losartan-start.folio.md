---
folio: "0.1"
id: "01E5T30TBG7463PA20XN2451FH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00503403"
effective: "2020-04-13T10:37:00-05:00"
recorded: "2020-04-13T10:37:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start losartan: ACE inhibitor cough.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38225",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 50 MG Oral Tablet", "rxnorm": "979485" },
    "dose": { "value": 50, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "ACE inhibitor cough",
    "visit_id": "V-2020-041386"
  }
}
```
