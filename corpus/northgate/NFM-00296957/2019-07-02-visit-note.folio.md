---
folio: "0.1"
id: "01DETADME0QJCY5VAAYHYWN709"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2019-07-02T11:45:00-05:00"
recorded: "2019-07-02T16:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-070252",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
