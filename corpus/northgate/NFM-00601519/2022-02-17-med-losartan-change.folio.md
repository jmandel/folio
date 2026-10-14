---
folio: "0.1"
id: "01FW47THFGFMYV0HH63RVX76DA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2022-02-17T10:21:00-06:00"
recorded: "2022-02-17T10:21:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change losartan: BP above goal.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27965",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2022-021761"
  }
}
```
