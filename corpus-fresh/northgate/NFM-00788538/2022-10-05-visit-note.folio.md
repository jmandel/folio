---
folio: "0.1"
id: "01GEMMGVP057DFREHY6S9VV3EQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00788538"
effective: "2022-10-05T10:40:00-05:00"
recorded: "2022-10-05T12:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 147/94, pulse 64, wt 171 lb.
Labs 9/30: eGFR 77, K 4.6, A1c 8.2%.
Empagliflozin started 10 mg daily today (A1c 8.2).
Patient ran out of lisinopril about 3 weeks ago and has not been taking it.
BP elevated today, likely related. Recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-100519",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-100519",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-100519",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
