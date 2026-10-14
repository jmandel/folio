---
folio: "0.1"
id: "01GTDAW010ZYSJSRFGZKVW9K4R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140901"
effective: "2023-02-28T14:20:00-06:00"
recorded: "2023-02-28T18:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 122/72, pulse 74, wt 243 lb.

Labs today: eGFR 65, UACR 207 mg/g, A1c 7.6%, LDL 89 mg/dL.

Results reviewed with pt. Diet and activity discussed. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022845",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022845",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-022845",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
