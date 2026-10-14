---
folio: "0.1"
id: "01K8K4F8D0Z9C7N9NHVK2YAD85"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00615037"
effective: "2025-10-27T08:15:00-05:00"
recorded: "2025-10-27T10:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 147/87, repeat 140/85, pulse 70, wt 177 lb.
Labs today: eGFR 44, K 4.5.
BP above goal, losartan dose changed to 100 mg daily today.
Pt voiced understanding. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-102765",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-102765",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-102765",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
