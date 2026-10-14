---
folio: "0.1"
id: "01DJ3SM7C0RHZJDSM5W5QZZFB3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00768389"
effective: "2019-08-12T10:15:00-05:00"
recorded: "2019-08-12T15:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and hyperlipidemia per pt.
BP 143/85, pulse 71, wt 169 lb.
Labs 8/6: eGFR 53, K 4.8, A1c 7.4%, LDL 76.
Records requested from prior office. Pt to return for f/u in a few months.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-081246",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-081246",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-081246",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
