---
folio: "0.1"
id: "01J5PPY360293TAACCH3EMH200"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272907"
effective: "2024-08-19T15:10:00-05:00"
recorded: "2024-08-19T20:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, problem list started today.
BP 115/75, pulse 75, wt 175 lb.
Feels well, no new complaints.
Records to be requested from prior office.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081973",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-081973",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
