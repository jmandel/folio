---
folio: "0.1"
id: "01KZPBZ10G3MF9BFDYFZ9RPAQ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2026-08-10T12:36:00-05:00"
recorded: "2026-08-10T12:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change metformin: eGFR 43.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-42754",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 43",
    "visit_id": "V-2026-081067"
  }
}
```
