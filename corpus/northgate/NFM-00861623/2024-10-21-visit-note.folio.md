---
folio: "0.1"
id: "01JAS0KKG0DAD0FH330HATAYPA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861623"
effective: "2024-10-21T15:30:00-05:00"
recorded: "2024-10-21T21:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

lisinopril: dose changed to 40 mg daily today (BP above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-102163",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-102163",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-102163",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
