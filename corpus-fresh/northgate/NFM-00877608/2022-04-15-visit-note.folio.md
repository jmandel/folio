---
folio: "0.1"
id: "01G0QSECY0NM582Y2RM418BBQ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2022-04-15T12:45:00-05:00"
recorded: "2022-04-15T18:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new concerns.
BP 134/77, pulse 75, wt 204 lb.
4/9 labs: eGFR 64, K 4.3, UACR 63 mg/g, A1c 6.9%, LDL 63.
Discussed diet and activity. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-041532",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-041532",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
