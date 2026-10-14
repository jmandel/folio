---
folio: "0.1"
id: "01H8YGQ1G0AQNY6PQQMNKHBBZ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2023-08-28T09:20:00-05:00"
recorded: "2023-08-28T11:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels fine.

BP 151/96, repeat 143/95, pulse 73, wt 209 lb.

Labs from 8/24: eGFR 65, K 4.8, UACR 103 mg/g, A1c 7.1%, LDL 154 mg/dL.

BP above goal, lisinopril dose changed to 40 mg daily today. Recheck BP and K at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082894",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082894",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
