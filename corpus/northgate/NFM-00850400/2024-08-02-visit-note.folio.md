---
folio: "0.1"
id: "01J4A0WC60HHZ29VQY1084HPBA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850400"
effective: "2024-08-02T09:15:00-05:00"
recorded: "2024-08-02T12:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

empagliflozin: started 10 mg daily today (A1c 9)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080269",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080269",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
