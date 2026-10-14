---
folio: "0.1"
id: "01G896TXQ042QAYS12V1BB7YE5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2022-07-18T10:40:00-05:00"
recorded: "2022-07-18T12:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well.
BP 129/75, pulse 66, wt 239 lb.
Labs 7/12: eGFR 91, UACR 299 mg/g, A1c 7.6%, LDL 109 mg/dL.
K 5.8 on 7/12 was hemolyzed; repeat K 4.5. Pt informed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071853",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071853",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-071853",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
