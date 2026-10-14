---
folio: "0.1"
id: "01DHMFZWN0QWVHQKKVVX0E49NJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2019-08-06T10:45:00-05:00"
recorded: "2019-08-06T17:15:00-05:00"
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

metformin: dose changed to 500 mg twice daily today (eGFR 42)

dapagliflozin: started 10 mg daily today (A1c 9.2, CKD)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-080672",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-080672",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
