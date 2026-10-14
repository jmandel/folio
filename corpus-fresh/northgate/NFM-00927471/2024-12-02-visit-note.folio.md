---
folio: "0.1"
id: "01JE454QT0HY1RV1V3B4NAGZ6B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927471"
effective: "2024-12-02T08:30:00-06:00"
recorded: "2024-12-02T11:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 141/84, pulse 64, wt 152 lb.
Today: eGFR 90, K 4.2, UACR 9 mg/g, A1c 7.6%, LDL 100.
BP a bit above goal in office. Labs otherwise stable.
Reviewed diet and exercise. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120266",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-120266",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-120266",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
