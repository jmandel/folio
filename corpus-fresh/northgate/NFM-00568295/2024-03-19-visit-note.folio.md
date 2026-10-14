---
folio: "0.1"
id: "01HSBP9Z909WH4Z7DG4P6CQ5W2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2024-03-19T08:15:00-05:00"
recorded: "2024-03-19T10:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u.
BP 145/94, repeat 137/92, pulse 79, wt 214 lb.
Labs today: eGFR 46, K 4.4, A1c 6.3%.
CKD stage 3a on problem list.
BP above goal, so lisinopril dose changed to 20 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031934",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031934",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
