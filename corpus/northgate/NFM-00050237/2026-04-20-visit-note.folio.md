---
folio: "0.1"
id: "01KPP2HYN0KX3Y5VHFX54AS45Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00050237"
effective: "2026-04-20T08:40:00-05:00"
recorded: "2026-04-20T13:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 145/89, pulse 63, wt 216 lb.
Labs 4/18: eGFR 55, K 3.9, LDL 118 mg/dL.
BP above goal, losartan dose changed to 100 mg daily today.
RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042024",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042024",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-042024",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-042024",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
