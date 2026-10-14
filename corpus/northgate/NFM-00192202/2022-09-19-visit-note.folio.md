---
folio: "0.1"
id: "01GDBS6R90P2YTAD1Z6V1SYDY2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00192202"
effective: "2022-09-19T10:30:00-05:00"
recorded: "2022-09-19T16:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Patient ran out of lisinopril about 3 weeks ago and has not been taking it.
BP 142/86, pulse 64, wt 238 lb.
Labs 9/15: eGFR 76, K 3.9, UACR 122 mg/g, A1c 7.7%, LDL 106 mg/dL.
Discussed importance of refills and keeping up with meds.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091924",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091924",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-091924",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
