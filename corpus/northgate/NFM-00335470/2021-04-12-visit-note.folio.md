---
folio: "0.1"
id: "01F33WDNA08APEBA001FBS3193"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00335470"
effective: "2021-04-12T12:30:00-05:00"
recorded: "2021-04-12T15:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 130/83, pulse 62, wt 216 lb.
Labs 4/8: eGFR 65, K 4.2, A1c 6.9%, LDL 92 mg/dL.
Reviewed results with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-041224",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-041224",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
