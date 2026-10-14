---
folio: "0.1"
id: "01GCSCBC00VZG1DV45165361PJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2022-09-12T08:40:00-05:00"
recorded: "2022-09-12T12:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no complaints.
BP 133/82, pulse 70, wt 189 lb.
Labs 9/6: eGFR 80, K 4.5.
BP at goal. Continue current regimen.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091294",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091294",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
