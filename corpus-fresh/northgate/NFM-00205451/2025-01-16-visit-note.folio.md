---
folio: "0.1"
id: "01JHRMK9W0CY6WJC4DHE1NG58F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2025-01-16T14:45:00-06:00"
recorded: "2025-01-16T16:44:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 144/90, repeat 136/86, pulse 65, wt 131 lb.
Labs 1/10: eGFR 84, K 4.6, LDL 85 mg/dL.
Repeat BP closer to goal. Pt feels well.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011675",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011675",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-011675",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
