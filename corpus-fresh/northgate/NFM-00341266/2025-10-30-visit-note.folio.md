---
folio: "0.1"
id: "01K8VC1370W4AW9XN06DZBZ8CF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2025-10-30T09:50:00-05:00"
recorded: "2025-10-30T15:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK.
BP 131/77, pulse 81, wt 186 lb.
10/28 labs: A1c 7.1%, eGFR 42, K 4.4.
Metformin changed to 500 mg BID today for eGFR 44.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-103074",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-103074",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
