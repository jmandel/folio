---
folio: "0.1"
id: "01HZJ8VXK0K60WW1N6G4X5MRN2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2024-06-04T11:15:00-05:00"
recorded: "2024-06-04T13:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 149/94, repeat 146/91. Pulse 74, wt 244 lb.
Labs today: eGFR 88, K 4.4, UACR 683 mg/g, A1c 7.6%.
A1c above goal. Dapagliflozin started 10 mg daily today.
BP above goal. Amlodipine continued today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-060463",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-060463",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
