---
folio: "0.1"
id: "01F36FNV70Y2GTFKZ3YDF2RF9C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00664672"
effective: "2021-04-13T09:15:00-05:00"
recorded: "2021-04-13T15:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing ok, no new concerns.
BP 129/77, pulse 87, wt 255 lb.
Labs 4/10: eGFR 64, K 4.3, UACR 53 mg/g, A1c 7.7%.
Discussed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-041313",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-041313",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-041313",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
