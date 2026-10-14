---
folio: "0.1"
id: "01JM0WTCQ0RXK2CEDRTE57CRPC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2025-02-13T12:50:00-06:00"
recorded: "2025-02-13T18:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c up again, discussed options with pt.
BP 134/82, pulse 62, wt 186 lb.
eGFR 82, K 4.7, A1c 8.4%.
Started insulin glargine 10 units at bedtime today. Also started dapagliflozin 10 mg daily today, A1c above goal.
RTC 6 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021328",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-021328",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-021328",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-021328",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2025-021328",
    "rank": 4,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
