---
folio: "0.1"
id: "01GFPX50X04WX3BYGWFM81P4XQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00039111"
effective: "2022-10-18T15:30:00-05:00"
recorded: "2022-10-18T20:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.

BP 145/92, repeat 140/91, pulse 68, wt 244 lb.

Labs 10/15: eGFR 49, K 4.3, A1c 7.4%, LDL 40 mg/dL. CKD stage 3a on problem list.

Reviewed results with pt. RTC 3 mo to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101885",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101885",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-101885",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
