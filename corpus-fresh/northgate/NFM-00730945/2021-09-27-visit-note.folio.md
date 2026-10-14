---
folio: "0.1"
id: "01FGMG7C00GDYW2HM1QPX5CYKP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2021-09-27T13:40:00-05:00"
recorded: "2021-09-27T15:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. CKD 3a on problem list.
BP 169/105, repeat 166/105. Pulse 71, wt 174 lb.
9/22 labs: eGFR 55, K 4.6, UACR 9 mg/g, A1c 7.4%.
BP above goal. Lisinopril changed to 40 mg daily today.
Recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092748",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092748",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092748",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
