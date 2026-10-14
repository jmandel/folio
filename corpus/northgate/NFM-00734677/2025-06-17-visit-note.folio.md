---
folio: "0.1"
id: "01JXZM4J907CBQ7PXZXF814DP9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00734677"
effective: "2025-06-17T08:45:00-05:00"
recorded: "2025-06-17T13:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 134/78, pulse 82, wt 157 lb.
Labs today: A1c 7.3%, eGFR 48, K 4.8, UACR 17 mg/g, LDL 124.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061755",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061755",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-061755",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
