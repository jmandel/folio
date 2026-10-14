---
folio: "0.1"
id: "01DV6BY25GZ0YBM624K78HHNE9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696353"
effective: "2019-12-03T11:11:00-06:00"
recorded: "2019-12-03T11:11:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 39. Metformin down to 500 mg BID.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-45773",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 39",
    "visit_id": "V-2019-120347"
  }
}
```
