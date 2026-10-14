---
folio: "0.1"
id: "01E2RB4K60YPN196CTMK7YTGRA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00685131"
effective: "2020-03-06T08:10:00-06:00"
recorded: "2020-03-06T10:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History reviewed with pt.

BP 135/81, pulse 70, wt 223 lb.
Labs 3/2: eGFR 60, K 4.2, UACR 150 mg/g.

Problem list started today. Will recheck BP and labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-030694",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-030694",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
