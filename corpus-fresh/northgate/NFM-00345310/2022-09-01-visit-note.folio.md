---
folio: "0.1"
id: "01GBXT60500P1VK0DCAZZ46XJ9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00345310"
effective: "2022-09-01T15:40:00-05:00"
recorded: "2022-09-01T19:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2, hypothyroidism per pt.
BP 129/77, pulse 77, wt 192 lb.
Labs 8/26: eGFR 43, K 4.4, A1c 8.5%, LDL 128.
Dapagliflozin started 10 mg daily today (A1c 8.5, CKD).
Nephrology referral placed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-090195",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-090195",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
