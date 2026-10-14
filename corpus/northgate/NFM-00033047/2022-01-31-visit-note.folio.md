---
folio: "0.1"
id: "01FTSBF2J01PAGNATTWNHDHPT7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2022-01-31T13:50:00-06:00"
recorded: "2022-01-31T18:38:00-06:00"
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
BP 138/84, pulse 80, wt 200 lb.
Today: eGFR 66, K 4.7, UACR 97 mg/g, A1c 7.6%.
Reviewed results, diet discussed.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-013136",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-013136",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
