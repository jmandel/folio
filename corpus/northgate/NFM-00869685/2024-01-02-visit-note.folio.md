---
folio: "0.1"
id: "01HK5XNFY0JB7CXKYSGFDS51DM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2024-01-02T12:15:00-06:00"
recorded: "2024-01-02T14:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 127/80, pulse 63, wt 201 lb.
eGFR 96 today. First K came back 6, sample hemolyzed; repeat K 4.8. LDL 110 mg/dL.
BP at goal. No changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010253",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010253",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
