---
folio: "0.1"
id: "01H8MRJMK0VXCXZ0Z0QZ7Q4313"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2023-08-24T12:10:00-05:00"
recorded: "2023-08-24T16:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.

BP 138/84, pulse 66, wt 213 lb.
Today: eGFR 63, K 4.9, UACR 18 mg/g, A1c 7%.

K a little high-normal, will recheck at next visit. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082445",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082445",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-082445",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
