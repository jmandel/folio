---
folio: "0.1"
id: "01HAZ2RY10GSAX0P4MFKYPWKZT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2023-09-22T10:15:00-05:00"
recorded: "2023-09-22T13:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 147/90, pulse 72, wt 212 lb.
Labs today: eGFR 47, K 4.8, A1c 6.5%, LDL 70.
BP above goal today. Kidney function reduced, will follow.
Problem list entered from pt history. RTC to review.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092219",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092219",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
