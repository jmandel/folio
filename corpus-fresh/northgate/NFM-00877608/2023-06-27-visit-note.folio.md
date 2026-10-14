---
folio: "0.1"
id: "01H3Z51YQ0AJN0065DRTVEK71T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2023-06-27T08:20:00-05:00"
recorded: "2023-06-27T14:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels fine.
BP 149/84, pulse 80, wt 203 lb.
Today eGFR 62, K 4.2, A1c 7.9%, LDL 95.
BP above goal, lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-062779",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-062779",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
