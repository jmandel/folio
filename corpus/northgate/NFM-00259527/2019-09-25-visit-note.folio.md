---
folio: "0.1"
id: "01DNN4FSM00DEV4YEQX35ZA0SY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2019-09-25T11:30:00-05:00"
recorded: "2019-09-25T16:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. No new complaints.

BP 148/91, pulse 73, wt 231 lb. Labs 9/23: eGFR 72, K 4.4, UACR 225 mg/g, A1c 6.5%, LDL 92 mg/dL.

BP above goal, lisinopril dose changed to 20 mg daily today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-092566",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-092566",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-092566",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
