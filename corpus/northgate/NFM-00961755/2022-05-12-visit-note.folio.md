---
folio: "0.1"
id: "01G2WXJZA05DX4ER7HW8EDAZ9W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00961755"
effective: "2022-05-12T13:20:00-05:00"
recorded: "2022-05-12T14:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

empagliflozin: started 10 mg daily today (A1c 8.4)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051298",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051298",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
