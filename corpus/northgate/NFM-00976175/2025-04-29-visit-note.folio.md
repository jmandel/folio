---
folio: "0.1"
id: "01JT1SH8300077C7VSN1JFKVX9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976175"
effective: "2025-04-29T11:40:00-05:00"
recorded: "2025-04-29T17:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 127/76, pulse 78, wt 224 lb.
BP at goal. No chest pain, SOB or headaches.
Wt up 1 lb from last year, discussed diet.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042954",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-042954",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
