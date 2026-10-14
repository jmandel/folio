---
folio: "0.1"
id: "01FDX9VZS0ZAMWBZWZJG92T31G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00572823"
effective: "2021-08-24T14:00:00-05:00"
recorded: "2021-08-24T19:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new concerns.
BP 136/78, pulse 64, wt 169 lb.
Labs 8/22: eGFR 64, K 4.1.
Reviewed results with pt.
RTC 10 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082453",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082453",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-082453",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-082453",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
