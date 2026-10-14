---
folio: "0.1"
id: "01ESSTGMX0AXBEM56NSBAWZK5A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00800453"
effective: "2020-12-17T15:50:00-06:00"
recorded: "2020-12-17T20:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no new complaints.

BP 136/80, pulse 84, wt 185 lb.

Labs 12/12: eGFR 42, K 4.7, UACR 269 mg/g. CKD stage 3b reviewed with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-121788",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-121788",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-121788",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
