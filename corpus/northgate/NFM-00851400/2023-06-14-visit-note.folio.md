---
folio: "0.1"
id: "01H2X9ZR706QKTNPMX4N7VVS8H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00851400"
effective: "2023-06-14T08:15:00-05:00"
recorded: "2023-06-14T10:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2, hyperlipidemia and obesity per pt.
BP 144/85, repeat 138/85. Pulse 85, wt 268 lb.
Labs 6/11: eGFR 67, K 4.4, UACR 181 mg/g, A1c 7%, LDL 78 mg/dL.
Problem list entered today. Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061472",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061472",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-061472",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-061472",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
