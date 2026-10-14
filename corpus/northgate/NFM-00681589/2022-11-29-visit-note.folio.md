---
folio: "0.1"
id: "01GK38Y8H0NMNN2FTDATPN4A4X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00681589"
effective: "2022-11-29T15:15:00-06:00"
recorded: "2022-11-29T21:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 148/86, repeat 141/85. Pulse 66, wt 156 lb.
Labs today: eGFR 94, K 4.6, LDL 90 mg/dL.
Problem list built from pt's history.
RTC to review BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112938",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112938",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-112938",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-112938",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
