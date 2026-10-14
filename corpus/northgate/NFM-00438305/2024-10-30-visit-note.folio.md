---
folio: "0.1"
id: "01JBG82G30277APB67WCG3M2G8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2024-10-30T15:45:00-05:00"
recorded: "2024-10-30T21:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No headache, chest pain or SOB.

BP 142/86, repeat 138/86, pulse 85, wt 216 lb. BP above goal.

Losartan: started 50 mg daily today (BP above goal). Pt to check BP at home and bring log.

RTC 6 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-103032",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-103032",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-103032",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-103032",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
