---
folio: "0.1"
id: "01H2R75VDGN2AVSSWE6J82HN59"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00371731"
effective: "2023-06-12T11:31:00-05:00"
recorded: "2023-06-12T11:31:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">start dapagliflozin: CKD + DM, cardiorenal benefit.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-40449",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488574" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "CKD + DM, cardiorenal benefit",
    "visit_id": "V-2023-061282"
  }
}
```
