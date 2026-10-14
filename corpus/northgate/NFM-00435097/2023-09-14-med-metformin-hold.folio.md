---
folio: "0.1"
id: "01HAA6Y4SGBVV5VSKGZTZ7STNV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00435097"
effective: "2023-09-14T11:03:00-05:00"
recorded: "2023-09-14T11:03:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">hold metformin: vomiting, poor oral intake.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-10437",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2023-09-21"
  }
}
```
