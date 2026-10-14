---
folio: "0.1"
id: "01FQCEZ5J0J34AYD0ESKJ5E2QT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00664672"
effective: "2021-12-20T08:50:00-06:00"
recorded: "2021-12-20T11:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt feels well.
BP 143/90, repeat 141/90, pulse 82, wt 255 lb.
Labs 12/15: eGFR 63, K 4.3, A1c 7.7%, LDL 113 mg/dL.
BP elevated today, will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-122082",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-122082",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-122082",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
