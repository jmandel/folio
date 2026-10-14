---
folio: "0.1"
id: "01EX08NRV0FHBNPV4SSWZKAVJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2021-01-26T13:00:00-06:00"
recorded: "2021-01-26T15:13:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 151/100, pulse 66, wt 132 lb.
eGFR 68, K 4.7, UACR 149 mg/g, A1c 7.9% today.
BP above goal, lisinopril dose changed to 20 mg daily today.
Recheck K and creatinine at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-012641",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-012641",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
