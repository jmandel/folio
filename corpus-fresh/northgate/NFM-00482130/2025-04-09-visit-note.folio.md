---
folio: "0.1"
id: "01JRDXCVM02KNVKMEA1XHY8WVR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2025-04-09T09:20:00-05:00"
recorded: "2025-04-09T13:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels OK, no new symptoms.
BP 150/92, repeat 144/91, pulse 87, wt 161 lb.
Labs today: eGFR 53, K 4.7, UACR 23 mg/g, A1c 7%.
Losartan: dose changed to 100 mg daily today (BP above goal). Pt informed.
RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-040912",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-040912",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-040912",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-040912",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
