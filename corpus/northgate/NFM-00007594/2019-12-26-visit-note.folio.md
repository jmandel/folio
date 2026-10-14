---
folio: "0.1"
id: "01DX22HH20G7AP5XECV3A4ZSV1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00007594"
effective: "2019-12-26T13:20:00-06:00"
recorded: "2019-12-26T15:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "visit_id": "V-2019-122681",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
