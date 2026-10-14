---
folio: "0.1"
id: "01GE7NKWD06CK3Z4RW9RFEWHZ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00005230"
effective: "2022-09-30T09:15:00-05:00"
recorded: "2022-09-30T12:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 134/83, pulse 76, wt 184 lb.
Labs today: eGFR 67, K 4.4, UACR 82 mg/g, A1c 7.5%.
Pt doing OK, no new complaints.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-093095",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-093095",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
