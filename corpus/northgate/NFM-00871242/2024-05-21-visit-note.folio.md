---
folio: "0.1"
id: "01HYEHFS90NZKN32BHES6HA782"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2024-05-21T12:30:00-05:00"
recorded: "2024-05-21T16:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

empagliflozin: started 10 mg daily today (CKD + DM, cardiorenal benefit)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052154",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
