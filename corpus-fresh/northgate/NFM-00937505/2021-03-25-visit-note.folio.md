---
folio: "0.1"
id: "01F1NPDGR0W29EFP07AX3XBZ3V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2021-03-25T15:20:00-05:00"
recorded: "2021-03-25T17:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new symptoms.
BP 120/71, pulse 74, wt 193 lb.
Labs 3/20: eGFR 65, K 4.2, A1c 6.8%, LDL 79 mg/dL.
Numbers stable. Encouraged exercise.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-032558",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-032558",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-032558",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
