---
folio: "0.1"
id: "01E3WCMTK0YCBPV2JCR7985AD8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2020-03-20T08:10:00-05:00"
recorded: "2020-03-20T11:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. HTN, DM2, obesity and knee OA by history.
BP 139/81, pulse 67, wt 203 lb.
Labs 3/17: eGFR 96, K 4.2, UACR 11 mg/g, A1c 6.7%, LDL 133 mg/dL.
Reviewed results with pt. Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-032095",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-032095",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
