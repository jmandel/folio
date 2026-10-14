---
folio: "0.1"
id: "01FM3EMN0003NKYX7KZNN3FDQF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2021-11-09T12:20:00-06:00"
recorded: "2021-11-09T16:56:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110918",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
