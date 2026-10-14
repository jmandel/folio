---
folio: "0.1"
id: "01GCFA4PK0RS2R2094HPTB9PKW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2022-09-08T10:10:00-05:00"
recorded: "2022-09-08T14:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and obesity per pt.
BP 146/88, pulse 62, wt 210 lb.
Labs today: eGFR 40, K 4.7, A1c 7.7%, LDL 103.
Problem list entered. Nephrology referral sent for the low eGFR.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-090872",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-090872",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-090872",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
