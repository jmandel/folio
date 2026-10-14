---
folio: "0.1"
id: "01HKN70NP0TX8NASTQHPWDCHAC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2024-01-08T08:45:00-06:00"
recorded: "2024-01-08T12:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new complaints.
BP 117/76, pulse 82, wt 224 lb.
Labs 1/5: eGFR 72, K 4.2.
Results discussed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010895",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010895",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
