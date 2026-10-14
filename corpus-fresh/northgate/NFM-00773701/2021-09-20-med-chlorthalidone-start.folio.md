---
folio: "0.1"
id: "01FG1RRP9G141NFB2QWXYGX46M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2021-09-20T09:11:00-05:00"
recorded: "2021-09-20T09:11:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Starting chlorthalidone 12.5 mg daily.</ref> Pt aware.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18813",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "chlorthalidone 25 MG Oral Tablet", "rxnorm": "197499" },
    "dose": { "value": 12.5, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1/2 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2021-092011"
  }
}
```
