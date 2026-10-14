---
folio: "0.1"
id: "01D4993M90M8V54A9RAFGSR30T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00825789"
effective: "2019-02-21T13:50:00-06:00"
recorded: "2019-02-21T18:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

metformin: dose changed to 500 mg twice daily today (eGFR 42)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-022136",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-022136",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
