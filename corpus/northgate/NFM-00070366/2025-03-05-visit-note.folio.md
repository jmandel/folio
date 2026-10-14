---
folio: "0.1"
id: "01JNKY5VA02ETXC0GKK8SS8P5V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00070366"
effective: "2025-03-05T11:30:00-06:00"
recorded: "2025-03-05T13:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
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
    "visit_id": "V-2025-030591",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-030591",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
