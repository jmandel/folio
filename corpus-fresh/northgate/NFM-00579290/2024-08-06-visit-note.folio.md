---
folio: "0.1"
id: "01J4N96H10XGYT5VGC3G5TPVPK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2024-08-06T15:00:00-05:00"
recorded: "2024-08-06T21:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 140/89, repeat 138/88. Pulse 85, wt 134 lb.
Labs 8/2: eGFR 65, K 4.4, A1c 7.6%, LDL 100 mg/dL.
Reviewed results with pt. BP a bit above goal, will keep an eye on it.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080691",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080691",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-080691",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
