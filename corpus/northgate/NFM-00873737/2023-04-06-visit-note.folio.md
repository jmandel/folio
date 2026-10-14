---
folio: "0.1"
id: "01GXBW06D0CF6GTCEHY4KCMH80"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2023-04-06T08:50:00-05:00"
recorded: "2023-04-06T13:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 133/91, pulse 86, wt 189 lb.
Labs 4/2: eGFR 60, K 4.8, A1c 6.6%, LDL 175 mg/dL.
LDL higher than before, discussed with pt. BP a bit high today, will recheck next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040687",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040687",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
