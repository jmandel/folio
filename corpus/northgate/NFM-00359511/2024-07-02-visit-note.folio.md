---
folio: "0.1"
id: "01J1TDTMK0A3MKJZCD5GF85D1K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2024-07-02T12:00:00-05:00"
recorded: "2024-07-02T14:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 122/74, pulse 65, wt 198 lb.
Labs 6/26: eGFR 45, K 4.6, A1c 7.6%.
Reviewed results with pt, feeling well. No changes today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-070212",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-070212",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-070212",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
