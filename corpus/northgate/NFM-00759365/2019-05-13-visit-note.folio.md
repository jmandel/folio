---
folio: "0.1"
id: "01DASD3R109RB7VJ461PQCFR7V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2019-05-13T08:45:00-05:00"
recorded: "2019-05-13T15:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and lipids per pt.
BP 151/91, repeat 147/91. Pulse 72, wt 194 lb.
Labs today: eGFR 69, K 4.2, A1c 6.5%.
Problem list built from pt history. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-051326",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-051326",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-051326",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2019-051326",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
