---
folio: "0.1"
id: "01G25SCEJ0YF4FQ11JQ67WWCDE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00993518"
effective: "2022-05-03T09:10:00-05:00"
recorded: "2022-05-03T15:22:00-05:00"
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
BP 142/82, pulse 85, wt 207 lb.
Labs today: eGFR 72, K 4.4, UACR 13 mg/g, A1c 7.2%.
BP still above goal. Chlorthalidone started 12.5 mg daily today (BP above goal).
RTC 3 mo, BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-050387",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-050387",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
