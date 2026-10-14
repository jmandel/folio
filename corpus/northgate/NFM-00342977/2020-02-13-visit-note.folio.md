---
folio: "0.1"
id: "01E10S9QC048R9HMD5ZMKD41YV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2020-02-13T15:15:00-06:00"
recorded: "2020-02-13T20:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 128/75, pulse 64, wt 172 lb.
Labs today: eGFR 76, K 4.6, A1c 7.7%.
Reviewed results with pt, diet and activity discussed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-021389",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-021389",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
