---
folio: "0.1"
id: "01GWATCT40H7W4PDHN6DSZ6C9K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00800453"
effective: "2023-03-24T14:10:00-05:00"
recorded: "2023-03-24T17:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Patient ran out of losartan about 3 weeks ago and has not been taking it.

BP 133/80, pulse 67, wt 187 lb.

Labs today: eGFR 37, K 5, UACR 313 mg/g, LDL 93 mg/dL.

Discussed importance of staying on meds. Will recheck labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032451",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032451",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-032451",
    "rank": 2,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-032451",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
