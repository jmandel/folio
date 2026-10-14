---
folio: "0.1"
id: "01EG1819V0DPB2DZGYMVGW0HQ8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2020-08-18T08:15:00-05:00"
recorded: "2020-08-18T11:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing OK, no complaints.
BP 142/91, pulse 69, wt 234 lb.
Labs 8/16: eGFR 69, K 4.2, LDL 110.
BP and LDL above where we want them. Diet and exercise discussed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-081859",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-081859",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-081859",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
