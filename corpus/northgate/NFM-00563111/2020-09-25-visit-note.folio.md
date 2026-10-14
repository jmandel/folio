---
folio: "0.1"
id: "01EK3ZMFH03RDETZ4HBG5X4YQB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00563111"
effective: "2020-09-25T13:50:00-05:00"
recorded: "2020-09-25T20:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 142/93, repeat 139/92. Pulse 63, wt 200 lb.

Today: eGFR 55, K 4.2, UACR 53 mg/g, A1c 6.5%.

BP above goal, so chlorthalidone started today at 12.5 mg daily. CKD stage 3a on problem list.

Pt agrees with plan. RTC to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-092592",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-092592",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-092592",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-092592",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
