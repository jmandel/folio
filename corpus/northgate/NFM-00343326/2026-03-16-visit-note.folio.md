---
folio: "0.1"
id: "01KKVWW180FT4A7MQKSZ80FB9E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00343326"
effective: "2026-03-16T10:15:00-05:00"
recorded: "2026-03-16T13:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 148/87, repeat 143/84, pulse 77, wt 195 lb.
Labs today: eGFR 97, K 4.3, A1c 7%, LDL 85 mg/dL.
BP above goal, so chlorthalidone started 12.5 mg daily today.
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031691",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031691",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-031691",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-031691",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
