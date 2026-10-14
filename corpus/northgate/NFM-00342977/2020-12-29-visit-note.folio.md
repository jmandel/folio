---
folio: "0.1"
id: "01ETQW5BF0DJHDBVYJ0A95Z9KA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2020-12-29T08:15:00-06:00"
recorded: "2020-12-29T12:29:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new concerns.

BP 126/79, pulse 70, wt 174 lb.

Labs 12/23: eGFR 74, K 4.7, UACR 14 mg/g, A1c 6.6%, LDL 144 mg/dL.

Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-122947",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-122947",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
