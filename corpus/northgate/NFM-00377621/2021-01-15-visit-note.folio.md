---
folio: "0.1"
id: "01EW3NHQ00FPTSJC0V8RQ5WFAN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2021-01-15T08:20:00-06:00"
recorded: "2021-01-15T12:40:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no hypoglycemia symptoms.
BP 128/76, pulse 75, wt 132 lb.
Labs 1/9: A1c 7.3%, eGFR 62, K 4.1, UACR 761 mg/g, LDL 71 mg/dL.
Diet counseling again.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-011589",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-011589",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-011589",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
