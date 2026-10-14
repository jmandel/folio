---
folio: "0.1"
id: "01JWBYAW4G5EKNFFM7JC7DAQRE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2025-05-28T12:16:00-05:00"
recorded: "2025-05-28T12:16:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Metformin held today, vomiting and poor oral intake. Review 6/4.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10122",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 1000 MG Oral Tablet", "rxnorm": "861004" },
    "dose": { "value": 1000, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2025-06-04"
  }
}
```
