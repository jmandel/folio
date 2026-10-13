---
folio: "0.1"
id: "01KH75WKB8JG67EVE934NYGH58"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2026-02-11T14:20:00-06:00"
recorded: "2026-02-11T14:22:09-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">eGFR 41 on 2/9. Metformin down to 500 mg BID (max 1000 mg/day at eGFR 30–44).</ref>
Pt informed by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18806",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 41"
  }
}
```
