---
folio: "0.1"
id: "01J349REE0DH6G71SEX6P3RHD7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945734"
effective: "2024-07-18T15:50:00-05:00"
recorded: "2024-07-18T20:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. No acute complaints.

BP 137/88, pulse 76, wt 215 lb.

Labs today: eGFR 64, K 4.4, A1c 7.1%, LDL 103 mg/dL.

Problem list entered. Will review results with pt at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071867",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071867",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
