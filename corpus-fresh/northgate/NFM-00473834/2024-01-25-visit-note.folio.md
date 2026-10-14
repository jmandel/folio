---
folio: "0.1"
id: "01HN1DGB60NCC4HC45BEF68EKS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2024-01-25T15:10:00-06:00"
recorded: "2024-01-25T16:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing OK.
BP 137/83, pulse 70, wt 235 lb.
Labs 1/20: eGFR 61, K 5.1, UACR 285 mg/g, A1c 8%.
A1c up a bit. Diet reviewed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012544",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012544",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
