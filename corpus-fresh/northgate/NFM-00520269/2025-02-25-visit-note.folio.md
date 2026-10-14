---
folio: "0.1"
id: "01JN01YBD08JZYSCBMA7KFAMZ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2025-02-25T15:20:00-06:00"
recorded: "2025-02-25T20:39:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes f/u. Pt feels well.
BP 122/76, pulse 83, wt 259 lb.
Labs 2/23: eGFR 42, K 4.6, UACR 695 mg/g, A1c 8.2%.
Insulin glargine dose changed to 14 units at bedtime today (A1c 8.2). Dapagliflozin started 10 mg daily today (CKD + DM, cardiorenal benefit).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-022541",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-022541",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-022541",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
