---
folio: "0.1"
id: "01HD73CFX06VJYR1922HB7YVKK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2023-10-20T09:00:00-05:00"
recorded: "2023-10-20T12:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 143/92, repeat 141/89. Pulse 74, wt 244 lb.
Labs 10/15: eGFR 89, K 4.3, UACR 558 mg/g, A1c 7.2%, LDL 162 mg/dL.
BP above goal. Losartan dose changed to 100 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-102081",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-102081",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
