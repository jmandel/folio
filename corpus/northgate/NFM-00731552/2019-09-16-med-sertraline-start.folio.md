---
folio: "0.1"
id: "01DMXAJR8GTNM4Y0AKHSMSV93C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2019-09-16T10:20:00-05:00"
recorded: "2019-09-16T10:20:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Sertraline 100 mg daily started today.</ref> Pt to call with any questions.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-27156",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "sertraline 100 MG Oral Tablet", "rxnorm": "312938" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "depression",
    "restricted": "BH",
    "visit_id": "V-2019-091669"
  }
}
```
