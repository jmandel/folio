---
folio: "0.1"
id: "01JWCM37B0KN0E12MMFR7CS0C9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2025-05-28T14:30:00-05:00"
recorded: "2025-05-28T18:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 131/79, pulse 74, wt 198 lb.
Labs 5/24: eGFR 38, K 4.5, A1c 7.4%.
Reviewed results with pt, no complaints. No changes today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052874",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052874",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
