---
folio: "0.1"
id: "01JESRK6P00EWTST4Z8YJHFDM3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2024-12-10T15:10:00-06:00"
recorded: "2024-12-10T20:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 137/87, pulse 75, wt 238 lb.

Labs today: eGFR 64, K 4.3, UACR 20 mg/g, A1c 6.7%, LDL 133 mg/dL.

A1c at goal. Will watch eGFR and UACR trend. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121051",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121051",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
