---
folio: "0.1"
id: "01K1EK4570XC9BD634PQFZVSXR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00003054"
effective: "2025-07-30T10:20:00-05:00"
recorded: "2025-07-30T16:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 134/84, pulse 82, wt 180 lb.

eGFR 55, K 4.4, LDL 124 mg/dL today.

Pt doing OK, no new symptoms. Results reviewed with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-073018",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-073018",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
