---
folio: "0.1"
id: "01FN7C11N0E0NEJGPZD6WK4JQA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2021-11-23T11:30:00-06:00"
recorded: "2021-11-23T15:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing well, no new complaints.
BP 129/86, pulse 85, wt 169 lb.
Meds reviewed, continue current regimen.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112376",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
