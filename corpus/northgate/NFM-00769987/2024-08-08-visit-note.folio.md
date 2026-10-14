---
folio: "0.1"
id: "01J4SFS5H0TKJSV9Z37A1E2TF5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00769987"
effective: "2024-08-08T09:20:00-05:00"
recorded: "2024-08-08T12:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 113/74, pulse 63, wt 218 lb.
Labs 8/6: eGFR 74, K 4.6, UACR 154 mg/g, A1c 6.1%, LDL 126 mg/dL.
Empagliflozin started 10 mg daily today for HFrEF.
Records requested from prior office. RTC to review labs and tolerance.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080853",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080853",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-080853",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
