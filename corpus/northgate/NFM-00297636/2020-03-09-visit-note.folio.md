---
folio: "0.1"
id: "01E3074J200N1MG07KPABT12AM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297636"
effective: "2020-03-09T09:00:00-05:00"
recorded: "2020-03-09T12:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.

BP 133/80, pulse 81, wt 195 lb.
Labs today: eGFR 73, K 5, UACR 8 mg/g, A1c 7.3%.

Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-030936",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-030936",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
