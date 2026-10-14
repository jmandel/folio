---
folio: "0.1"
id: "01HYP2CGZ0JDSCJ0B13M9PWBAK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2024-05-24T08:45:00-05:00"
recorded: "2024-05-24T14:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.
BP 139/81, pulse 69, wt 163 lb.
Labs today: eGFR 59, K 4.7, A1c 7.1%, LDL 146 mg/dL.
eGFR 59 today, CKD stage 3a. Discussed with pt.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052481",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052481",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-052481",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
