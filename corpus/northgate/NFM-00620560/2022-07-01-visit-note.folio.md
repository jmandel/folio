---
folio: "0.1"
id: "01G6XVXTD0WWXKH0W2ZW1FD45Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620560"
effective: "2022-07-01T12:10:00-05:00"
recorded: "2022-07-01T16:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 148/86, repeat 141/84. Pulse 82, wt 169 lb.
Labs 6/28: eGFR 70, K 4.4, LDL 86.
BP above goal, chlorthalidone started 12.5 mg daily today.
Recheck labs and BP at f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-070147",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-070147",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-070147",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-070147",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
