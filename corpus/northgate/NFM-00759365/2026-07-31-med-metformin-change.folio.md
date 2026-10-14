---
folio: "0.1"
id: "01KYWNPRTG28B65S7BYX599T1N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2026-07-31T13:06:00-05:00"
recorded: "2026-07-31T13:06:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 45. Metformin down to 500 mg BID.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-46613",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 45",
    "visit_id": "V-2026-073177"
  }
}
```
