---
folio: "0.1"
id: "01F1FX5V6G478VP46VJ9KCMJ33"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00516657"
effective: "2021-03-23T11:02:00-05:00"
recorded: "2021-03-23T11:02:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril held today, vomiting and poor oral intake. Review 3/30.</ref> Pt informed by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-16311",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "lisinopril 20 MG Oral Tablet", "rxnorm": "314077" },
    "dose": { "value": 20, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "vomiting, poor oral intake",
    "review_on": "2021-03-30"
  }
}
```
