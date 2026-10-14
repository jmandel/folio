---
folio: "0.1"
id: "01HGEFJXJ0FXG08060RJJSB419"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2023-11-29T09:10:00-06:00"
recorded: "2023-11-29T15:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 140/83, repeat 136/83, pulse 82, wt 149 lb.
Labs today: eGFR 89, K 4.4, A1c 7.8%, LDL 83.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112996",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112996",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
