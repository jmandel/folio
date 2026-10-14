---
folio: "0.1"
id: "01G12AMSX0J4R5Q44XPEAEWKV8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2022-04-19T14:45:00-05:00"
recorded: "2022-04-19T20:51:00-05:00"
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
BP 135/77, pulse 66, wt 228 lb.
Labs 4/13: eGFR 92, K 4.2, UACR 582 mg/g, A1c 8%.
Reviewed results with pt, will follow closely.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-041963",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-041963",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-041963",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
