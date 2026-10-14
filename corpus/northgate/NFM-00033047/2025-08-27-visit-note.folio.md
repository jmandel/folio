---
folio: "0.1"
id: "01K3P5KEE0QWFEW9BGK8J6YHGK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2025-08-27T08:50:00-05:00"
recorded: "2025-08-27T11:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well, no new sx.
BP 117/79, pulse 77, wt 197 lb.
Today: eGFR 53, K 4.3, UACR 202 mg/g, A1c 7.7%, LDL 147 mg/dL.
Reviewed results with pt. UACR rising, will keep following.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082743",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-082743",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-082743",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
