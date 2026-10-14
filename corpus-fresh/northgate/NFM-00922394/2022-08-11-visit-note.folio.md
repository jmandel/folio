---
folio: "0.1"
id: "01GA77ZPP045DGX8E4WV5Q9V86"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2022-08-11T10:45:00-05:00"
recorded: "2022-08-11T15:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam f/u. Doing OK.

BP 141/81, pulse 68, wt 156 lb.
8/8: eGFR 66, K 4.4, A1c 7.7%.

BP above goal. Losartan dose changed to 100 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-081122",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-081122",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-081122",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
