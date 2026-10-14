---
folio: "0.1"
id: "01K81Z8SK087KHN1X0WJK9NPCY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929295"
effective: "2025-10-20T12:10:00-05:00"
recorded: "2025-10-20T18:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 155/95, repeat 152/94, pulse 77, wt 140 lb.
Labs today: eGFR 74, K 4.5, UACR 48 mg/g, A1c 7.9%.
BP above goal, chlorthalidone started 12.5 mg daily today.
RTC 3 mo, BP recheck then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-102087",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-102087",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-102087",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-102087",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
