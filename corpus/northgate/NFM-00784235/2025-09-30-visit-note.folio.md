---
folio: "0.1"
id: "01K6DSJKZ07NTCM91ASGZZBGV0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00784235"
effective: "2025-09-30T08:15:00-05:00"
recorded: "2025-09-30T12:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new complaints.

BP 142/80, pulse 74, wt 203 lb.

Labs 9/27: eGFR 90, K 4.2, UACR 55 mg/g, A1c 7.9%.

BP above goal today. Will recheck at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-093075",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-093075",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-093075",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
