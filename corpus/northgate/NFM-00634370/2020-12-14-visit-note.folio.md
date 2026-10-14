---
folio: "0.1"
id: "01ESH70400TQFM0R81X9C011FQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634370"
effective: "2020-12-14T09:15:00-06:00"
recorded: "2020-12-14T12:08:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 136/78, pulse 77, wt 199 lb.
Labs 12/9: eGFR 45, K 4.6, LDL 74 mg/dL.
Problem list built from pt's history today.
RTC to review BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-121453",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-121453",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-121453",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-121453",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
