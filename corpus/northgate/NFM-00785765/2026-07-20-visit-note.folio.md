---
folio: "0.1"
id: "01KY06TRG0KAZ282YJJB0H65V2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2026-07-20T08:10:00-05:00"
recorded: "2026-07-20T11:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 133/81, pulse 85, wt 222 lb.
Today: eGFR 43, K 4.3, A1c 7.5%.
eGFR 43, so metformin dose changed to 500 mg twice daily today. Referring to nephrology.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-072093",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-072093",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-072093",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-072093",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-072093",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
