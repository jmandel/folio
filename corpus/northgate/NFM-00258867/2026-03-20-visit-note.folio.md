---
folio: "0.1"
id: "01KM6A4380QWGZBSZ4DPMVHZT7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258867"
effective: "2026-03-20T12:00:00-05:00"
recorded: "2026-03-20T14:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new complaints.

BP 139/82, pulse 64, wt 160 lb.

Labs today: eGFR 55, K 4.4, UACR 17 mg/g, A1c 8%.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032065",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032065",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-032065",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-032065",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-032065",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
