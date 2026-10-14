---
folio: "0.1"
id: "01JW6YBSK0BEYNM1RDCBXJ5S8K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00155300"
effective: "2025-05-26T08:45:00-05:00"
recorded: "2025-05-26T13:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 128/78, pulse 87, wt 197 lb.
Labs today: eGFR 70, K 4.3, A1c 7.1%, LDL 151 mg/dL.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052675",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052675",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
