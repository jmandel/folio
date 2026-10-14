---
folio: "0.1"
id: "01J2YBNP00HX8SZBA9JZ4BSKWE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00025136"
effective: "2024-07-16T08:20:00-05:00"
recorded: "2024-07-16T13:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 145/85, repeat 138/85, pulse 81, wt 210 lb.
Labs today: eGFR 64, K 4.4, LDL 86 mg/dL.
Losartan dose changed to 100 mg daily today (BP above goal).
RTC 3 mo for BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071655",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071655",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-071655",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-071655",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
