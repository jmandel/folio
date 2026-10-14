---
folio: "0.1"
id: "01GRM6AT50J19XB1JAY8BRZTQ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2023-02-06T10:45:00-06:00"
recorded: "2023-02-06T14:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.

BP 155/90, repeat 149/88. Pulse 67, wt 226 lb.

Labs 2/1: eGFR 66, K 4.6, A1c 7%, LDL 66.

BP above goal today, home log to be brought next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020628",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020628",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-020628",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
