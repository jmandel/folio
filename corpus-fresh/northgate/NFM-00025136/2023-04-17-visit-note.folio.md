---
folio: "0.1"
id: "01GY83P1G0CE3ZH4BZDC59NDZ0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00025136"
effective: "2023-04-17T08:45:00-05:00"
recorded: "2023-04-17T12:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 139/87, pulse 87, wt 208 lb.
Labs 4/13: eGFR 65, K 4.8, LDL 69 mg/dL.
Problem list built from pt's history today.
RTC to be scheduled for chronic care f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-041748",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-041748",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-041748",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-041748",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
