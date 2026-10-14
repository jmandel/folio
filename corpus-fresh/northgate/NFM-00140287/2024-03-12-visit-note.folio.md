---
folio: "0.1"
id: "01HRTG9W50NG6D7841T453E9PJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2024-03-12T13:40:00-05:00"
recorded: "2024-03-12T18:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 142/84, repeat 134/82, pulse 83, wt 159 lb.
Today: eGFR 37, K 4.5, UACR 535 mg/g, A1c 6.8%.
UACR up from prior. Discussed with pt, will keep following closely.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031213",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031213",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-031213",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
