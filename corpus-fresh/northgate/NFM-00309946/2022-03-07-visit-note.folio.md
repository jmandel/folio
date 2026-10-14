---
folio: "0.1"
id: "01FXKD8FK0Z63VDBG9CYVEDR88"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00309946"
effective: "2022-03-07T13:20:00-06:00"
recorded: "2022-03-07T18:01:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 149/88, pulse 71, wt 127 lb.
Labs today: eGFR 65, K 5, UACR 87 mg/g, A1c 7.1%, LDL 104 mg/dL.
Losartan dose changed to 100 mg daily today, BP above goal.
RTC 3 mo, recheck K.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-030762",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-030762",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-030762",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-030762",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
