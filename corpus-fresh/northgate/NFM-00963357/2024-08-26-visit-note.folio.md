---
folio: "0.1"
id: "01J687MKB0VJMX6NZZPKDCPX7N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00963357"
effective: "2024-08-26T13:40:00-05:00"
recorded: "2024-08-26T15:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.

BP 147/82, repeat 139/80, pulse 85, wt 189 lb.

Labs today: eGFR 83, K 4.1, A1c 7.1%, LDL 99.

Problem list entered from pt history. RTC to review plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-082654",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-082654",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-082654",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
