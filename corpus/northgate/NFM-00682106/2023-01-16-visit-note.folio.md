---
folio: "0.1"
id: "01GPXYS3403V3B0YN88EMRYY52"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00682106"
effective: "2023-01-16T08:15:00-06:00"
recorded: "2023-01-16T12:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.

BP 122/80, pulse 77, wt 239 lb.
Labs 1/10: eGFR 69, K 4.2, A1c 6.4%, LDL 86 mg/dL.

Reviewed results with pt, counseled on diet and exercise.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011692",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-011692",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-011692",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
