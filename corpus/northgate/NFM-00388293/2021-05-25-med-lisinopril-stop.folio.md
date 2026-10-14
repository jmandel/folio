---
folio: "0.1"
id: "01F6JM7TEG2DBFSXJ6XSRS4CVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2021-05-25T15:42:00-05:00"
recorded: "2021-05-25T15:42:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">stop lisinopril: dry cough.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43705",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "dry cough",
    "visit_id": "V-2021-052596"
  }
}
```
