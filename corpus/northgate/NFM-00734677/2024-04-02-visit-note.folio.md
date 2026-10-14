---
folio: "0.1"
id: "01HTGCPHD0M9CEE5MRRSR4FRTY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00734677"
effective: "2024-04-02T12:40:00-05:00"
recorded: "2024-04-02T16:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Labs from 3/28 reviewed with pt: A1c 7.2%, eGFR 50, K 4.2, UACR 15 mg/g, LDL 102.
BP 143/87, pulse 67, wt 155 lb.
Started empagliflozin 10 mg daily today for CKD + DM, cardiorenal benefit.
BP above goal, started chlorthalidone 12.5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040256",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040256",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-040256",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-040256",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2024-040256",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
