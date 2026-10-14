---
folio: "0.1"
id: "01E47DD920T4AXF11Q71WN9SA0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2020-03-24T14:20:00-05:00"
recorded: "2020-03-24T18:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 151/91, pulse 79, wt 224 lb.

Labs 3/21: eGFR 72, K 4.4, A1c 8%.

BP above goal, lisinopril increased to 20 mg daily today.

RTC 3 mo, recheck BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-032448",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-032448",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-032448",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
