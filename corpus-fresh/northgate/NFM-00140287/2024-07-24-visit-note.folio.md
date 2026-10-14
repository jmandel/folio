---
folio: "0.1"
id: "01J3K85WS0TVF4GQ0659SC4H5A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2024-07-24T14:15:00-05:00"
recorded: "2024-07-24T15:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 131/83, pulse 84, wt 157 lb.
Labs today: eGFR 37, K 4.7, UACR 482 mg/g, A1c 7.4%, LDL 125.
A1c a bit higher than last time. Reviewed diet and activity with pt.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072433",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072433",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-072433",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
