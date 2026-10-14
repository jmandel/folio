---
folio: "0.1"
id: "01JXZAPEA0RC6DF1CSRZNC82MJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00574603"
effective: "2025-06-17T08:15:00-05:00"
recorded: "2025-06-17T11:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 124/74, pulse 69, wt 192 lb.
Labs today: eGFR 95, A1c 7.9%, LDL 149 mg/dL.
Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061776",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061776",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
