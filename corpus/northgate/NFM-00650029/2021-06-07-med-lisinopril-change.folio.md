---
folio: "0.1"
id: "01F7KTFGTG26WT72M2SNW79S4V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2021-06-07T13:06:00-05:00"
recorded: "2021-06-07T13:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Lisinopril changed to 20 mg daily today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-22432",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2021-060739"
  }
}
```
