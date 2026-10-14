---
folio: "0.1"
id: "01DEG4NE70X158S6JNTTJTMTEA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2019-06-28T12:45:00-05:00"
recorded: "2019-06-28T17:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History per pt.

BP 141/94, repeat 139/93. Pulse 83, wt 225 lb.

Labs 6/22: eGFR 71, K 4.8, UACR 189 mg/g, A1c 7.4%, LDL 70.

Problem list entered today. Records requested from prior office.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-062896",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-062896",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-062896",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
