---
folio: "0.1"
id: "01EZQF2ZN033SMHM5620CNZ5SK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2021-03-01T08:10:00-06:00"
recorded: "2021-03-01T11:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing ok, no complaints.
BP 115/71, pulse 67, wt 243 lb.
Labs 2/27: eGFR 62, K 4.4, UACR 18 mg/g, A1c 7.7%.
Reviewed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-030138",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-030138",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-030138",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
