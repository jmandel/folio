---
folio: "0.1"
id: "01H2VDJ5709FNTR3HR9KZ77878"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00438305"
effective: "2023-06-13T12:41:00-05:00"
recorded: "2023-06-13T17:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
ED f/u, angioedema. Swelling has settled, lips and tongue back to normal today.

Lisinopril allergy: angioedema of lips and tongue. Lisinopril: stopped today (angioedema). Added to allergy list.

Amlodipine: dose changed to 10 mg daily today, replacing lisinopril (angioedema).

Pt to call or go to ED if swelling returns. RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061359",
    "visit_type": "office",
    "reason": "ED follow-up: angioedema"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061359",
    "rank": 1,
    "icd10cm": "T78.3XXA",
    "display": "Angioneurotic edema, initial encounter"
  }
}
```
