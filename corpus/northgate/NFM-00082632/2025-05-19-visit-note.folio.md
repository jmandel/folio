---
folio: "0.1"
id: "01JVNEP840MHVV1RJY019358G3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2025-05-19T14:10:00-05:00"
recorded: "2025-05-19T18:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feeling well, no new complaints.
BP 125/74, pulse 76, wt 197 lb.
Labs today: A1c 7.4%, eGFR 87, K 4.2, LDL 92 mg/dL, UACR 197 mg/g.
Reviewed results with pt, urine albumin still elevated, will keep watching.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051973",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051973",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-051973",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
