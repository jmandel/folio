---
folio: "0.1"
id: "01FWF2Y8R0JW0KA353W3RFXRV8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2022-02-21T12:40:00-06:00"
recorded: "2022-02-21T15:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints, exam unremarkable.

BP 133/75, pulse 78, wt 170 lb. eGFR 67 today.

Discussed diet and exercise. RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-022174",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-022174",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-022174",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
