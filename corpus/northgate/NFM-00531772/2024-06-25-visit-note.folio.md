---
folio: "0.1"
id: "01J18J0X80YHS0W6DAPGB2CAJQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2024-06-25T09:45:00-05:00"
recorded: "2024-06-25T15:40:00-05:00"
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

metformin: dose changed to 500 mg twice daily today (eGFR 37)

insulin glargine: started 10 units at bedtime today (A1c 8.4)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062579",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
