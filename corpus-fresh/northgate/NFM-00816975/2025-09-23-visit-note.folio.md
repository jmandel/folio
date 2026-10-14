---
folio: "0.1"
id: "01K5VTGGS00DG031C8KN9SNNSP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2025-09-23T09:45:00-05:00"
recorded: "2025-09-23T12:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 132/75, pulse 70, wt 226 lb.
Labs 9/18: eGFR 46, K 4.8, A1c 7.8%, LDL 91 mg/dL.
Metformin dose changed to 500 mg twice daily today (eGFR 44).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092393",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092393",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-092393",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
