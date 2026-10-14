---
folio: "0.1"
id: "01EKNGS2VG1HT9GVWP0N8C5R3F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2020-10-02T15:41:00-05:00"
recorded: "2020-10-02T15:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.2. Metformin up to 1000 mg BID.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43032",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "A1c 8.2",
    "visit_id": "V-2020-100297"
  }
}
```
