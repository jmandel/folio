---
folio: "0.1"
id: "01EM4D55D0M5K9C6P4CCG36GYC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2020-10-08T08:20:00-05:00"
recorded: "2020-10-08T10:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2, obesity and knee OA per pt.
BP 134/74, pulse 67, wt 211 lb.
Labs today: eGFR 75, K 4.7, UACR 49 mg/g, A1c 7.3%, LDL 164 mg/dL.
Reviewed results with pt. Problem list entered from history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-100848",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-100848",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
