---
folio: "0.1"
id: "01DQR9R1F0ZJ3ZC7F5M3ZAAZBY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939437"
effective: "2019-10-21T14:15:00-05:00"
recorded: "2019-10-21T18:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 144/91, repeat 139/87. Pulse 63, wt 183 lb.
Outside labs 10/17: eGFR 82, K 4, A1c 8%, LDL 74.
Problem list entered today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-102111",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-102111",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-102111",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
