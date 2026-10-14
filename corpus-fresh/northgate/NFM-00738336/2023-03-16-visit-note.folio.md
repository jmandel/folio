---
folio: "0.1"
id: "01GVPQ0E00JATM5DCA2ARQ073G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738336"
effective: "2023-03-16T15:20:00-05:00"
recorded: "2023-03-16T21:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 140/86, repeat 134/85, pulse 78, wt 211 lb.
Labs today: eGFR 70, K 4.5, UACR 10 mg/g, A1c 7.4%.
Pt doing OK, no new complaints. Repeat BP near goal.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-031638",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-031638",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-031638",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
