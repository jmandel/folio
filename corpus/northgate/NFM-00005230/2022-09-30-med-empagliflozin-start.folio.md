---
folio: "0.1"
id: "01GE7D804GHBMHW3ZKC0WVW0C4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00005230"
effective: "2022-09-30T09:36:00-05:00"
recorded: "2022-09-30T09:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start empagliflozin: A1c 8.3.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10482",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.3",
    "visit_id": "V-2022-093092"
  }
}
```
