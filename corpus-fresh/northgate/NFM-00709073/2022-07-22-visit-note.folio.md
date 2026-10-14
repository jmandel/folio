---
folio: "0.1"
id: "01G8KEFHH0XVYKV26ENRCCWF1C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00709073"
effective: "2022-07-22T09:40:00-05:00"
recorded: "2022-07-22T12:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new complaints.
BP 131/80, pulse 75, wt 233 lb.
Labs 7/18: eGFR 79, K 4.4, A1c 7.3%.
A1c improved. No changes today. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072262",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072262",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
