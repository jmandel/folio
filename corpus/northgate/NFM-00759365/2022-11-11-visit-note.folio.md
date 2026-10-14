---
folio: "0.1"
id: "01GHM7W140JD9RY8D940M7EX4Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2022-11-11T13:00:00-06:00"
recorded: "2022-11-11T15:00:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 136/86, pulse 71, wt 193 lb.
11/9 labs: eGFR 65, A1c 7.1%. K came back 5.9 but sample was hemolyzed; repeat K 4.2.
Nephrology referral placed today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-111137",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-111137",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-111137",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
