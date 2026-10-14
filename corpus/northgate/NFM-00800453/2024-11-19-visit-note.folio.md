---
folio: "0.1"
id: "01JD2YECP088S3VFKJCST3YEMA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00800453"
effective: "2024-11-19T10:15:00-06:00"
recorded: "2024-11-19T13:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new concerns.

BP 135/85, pulse 64, wt 187 lb.

Labs today: eGFR 31, K 4.5, UACR 349 mg/g, LDL 91 mg/dL.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-111924",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-111924",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-111924",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
