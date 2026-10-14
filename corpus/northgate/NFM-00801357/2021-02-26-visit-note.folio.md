---
folio: "0.1"
id: "01EZG0ZZ2094DK32HMSY21HY5E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00801357"
effective: "2021-02-26T11:20:00-06:00"
recorded: "2021-02-26T14:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 131/74, pulse 88, wt 245 lb.
Labs today: eGFR 60, K 4.1, A1c 8.1%.
Metformin dose changed to 1000 mg twice daily today (A1c 8.1).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-022676",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-022676",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
