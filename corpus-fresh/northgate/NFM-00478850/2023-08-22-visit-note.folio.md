---
folio: "0.1"
id: "01H8FBN690060QEVYH84W6Q0YM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2023-08-22T09:00:00-05:00"
recorded: "2023-08-22T14:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels OK, no new symptoms.
BP 137/87, pulse 74, wt 161 lb.
Labs 8/19: eGFR 68, K 4.4, A1c 7.6%, LDL 85 mg/dL.
Stable overall. Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082227",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082227",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-082227",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
