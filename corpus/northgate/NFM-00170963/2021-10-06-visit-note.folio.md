---
folio: "0.1"
id: "01FHBW1DQ0FS272JXJ4C349NPP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00170963"
effective: "2021-10-06T15:40:00-05:00"
recorded: "2021-10-06T17:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms, no hypoglycemia.

BP 135/81, pulse 62, wt 230 lb.

Labs today: eGFR 77, K 4.5, UACR 53 mg/g, A1c 7.2%, LDL 66.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-100659",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-100659",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-100659",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
