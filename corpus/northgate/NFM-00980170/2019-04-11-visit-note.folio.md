---
folio: "0.1"
id: "01D87F5570NBV6J8E7EFE363C1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00980170"
effective: "2019-04-11T15:45:00-05:00"
recorded: "2019-04-11T19:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 140/89, repeat 133/89. Pulse 81, wt 177 lb.
Labs from 4/5 reviewed: eGFR 42, K 4.7, UACR 57 mg/g, LDL 89 mg/dL.
Records and history reviewed with pt.
RTC to recheck labs and BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-041118",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-041118",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-041118",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
