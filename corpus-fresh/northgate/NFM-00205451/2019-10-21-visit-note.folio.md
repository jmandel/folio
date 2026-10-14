---
folio: "0.1"
id: "01DQR907R0BNWYC5DHPWG9YDKT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2019-10-21T11:40:00-05:00"
recorded: "2019-10-21T18:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 154/93, repeat 146/93. Pulse 72, wt 130 lb.
Labs from 10/16: eGFR 89, K 4, LDL 64 mg/dL.
BP elevated on both readings, will recheck at next visit.
Problem list updated. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-102161",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-102161",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
