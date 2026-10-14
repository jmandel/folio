---
folio: "0.1"
id: "01HMD65M302EG0YZ24S1KV63DZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00114088"
effective: "2024-01-17T14:40:00-06:00"
recorded: "2024-01-17T20:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 118/68, pulse 66, wt 194 lb.
Labs today: eGFR 73, K 4, LDL 78 mg/dL.
No acute complaints. Records to be requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011733",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011733",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
