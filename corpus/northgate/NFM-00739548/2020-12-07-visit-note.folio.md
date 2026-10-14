---
folio: "0.1"
id: "01ERZSQFF09QQR91G1D5ZDB0F5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00739548"
effective: "2020-12-07T15:50:00-06:00"
recorded: "2020-12-07T17:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 140/86, repeat 132/83, pulse 84, wt 171 lb.
Labs today: eGFR 60, K 4.4, A1c 6.1%, LDL 92 mg/dL.
BP above goal, lisinopril increased to 20 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-120771",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-120771",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
