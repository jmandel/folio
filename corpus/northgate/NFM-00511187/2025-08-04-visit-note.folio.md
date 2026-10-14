---
folio: "0.1"
id: "01K1VH3V00BAAQEBHY948EGEY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00511187"
effective: "2025-08-04T10:45:00-05:00"
recorded: "2025-08-04T16:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No chest pain, SOB or headache.
BP 145/90, repeat 140/89, pulse 65, wt 207 lb.
BP above goal today. Will recheck at next visit; pt to keep home readings.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-080499",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-080499",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
