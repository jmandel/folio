---
folio: "0.1"
id: "01EEGHGVW073N73ZZN78VRA2J6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00268144"
effective: "2020-07-30T08:15:00-05:00"
recorded: "2020-07-30T14:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 143/87, repeat 140/84. Pulse 65, wt 203 lb.

Labs today: eGFR 50, K 4.6, UACR 507 mg/g, A1c 7.7%. Meets criteria for CKD stage 3a, added to problem list.

BP above goal, so lisinopril dose changed to 40 mg daily today.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-073079",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-073079",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-073079",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-073079",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
