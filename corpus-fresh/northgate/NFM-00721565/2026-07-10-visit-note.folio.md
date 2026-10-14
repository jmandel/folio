---
folio: "0.1"
id: "01KX72HER0RXGYK4YJ0FDFV76D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2026-07-10T14:40:00-05:00"
recorded: "2026-07-10T17:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 140/83, repeat 138/82, pulse 71, wt 208 lb.
Labs 7/6: eGFR 32, K 4.5, UACR 83 mg/g, A1c 7.7%.
Reviewed labs with pt. Feels well, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-071029",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-071029",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-071029",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
