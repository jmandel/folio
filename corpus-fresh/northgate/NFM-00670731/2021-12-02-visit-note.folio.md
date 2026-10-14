---
folio: "0.1"
id: "01FNYQHYD0XEF1A5CG81CD189F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2021-12-02T15:30:00-06:00"
recorded: "2021-12-02T17:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 143/75, repeat 140/72. Pulse 67, wt 220 lb.
eGFR 60, K 4.6, A1c 6.4% today.
BP above goal, lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-120247",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-120247",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
