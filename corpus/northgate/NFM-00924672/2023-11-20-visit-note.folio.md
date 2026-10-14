---
folio: "0.1"
id: "01HFQNENA0P5NDFVD7ABWFK07H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924672"
effective: "2023-11-20T15:50:00-06:00"
recorded: "2023-11-20T18:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new symptoms.

BP 129/86, pulse 71, wt 179 lb.
Today eGFR 60, K 4.3, UACR 13 mg/g.

Discussed results with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112069",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112069",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
