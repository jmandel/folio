---
folio: "0.1"
id: "01GDBXNJK08ZGDPCEP2J8CWK00"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2022-09-19T11:40:00-05:00"
recorded: "2022-09-19T17:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 156/94, repeat 148/92, pulse 85, wt 231 lb.
Labs 9/17: eGFR 67, K 4.3.
BP above goal, so losartan started 50 mg daily today.
RTC 4 wk for BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091929",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091929",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-091929",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
