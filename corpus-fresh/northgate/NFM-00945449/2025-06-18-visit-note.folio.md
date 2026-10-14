---
folio: "0.1"
id: "01JY1ZG280CNRJ1EVA4CXS3MJC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945449"
effective: "2025-06-18T08:40:00-05:00"
recorded: "2025-06-18T11:56:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 137/82, pulse 72, wt 214 lb.
Today: eGFR 59, K 3.8, UACR 221 mg/g, A1c 7.5%.
Reviewed results with pt, no new symptoms.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061853",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061853",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-061853",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
