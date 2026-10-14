---
folio: "0.1"
id: "01J4N5TG005307CY8WSXV6S8QV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2024-08-06T14:10:00-05:00"
recorded: "2024-08-06T20:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 146/83, pulse 81, wt 173 lb.
Labs today: eGFR 94, K 3.8.
BP above goal today. Kidney function stable.
Reviewed home BP checks with pt.
RTC to recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080612",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080612",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-080612",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
