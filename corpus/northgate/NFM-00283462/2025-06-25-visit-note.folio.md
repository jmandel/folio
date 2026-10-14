---
folio: "0.1"
id: "01JYKX6760WZGWQGBK73C4BD8M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283462"
effective: "2025-06-25T08:00:00-05:00"
recorded: "2025-06-25T11:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 144/86, pulse 80, wt 194 lb. Still above goal.

Labs today: eGFR 48, K 4.6, LDL 93 mg/dL.

Amlodipine started, 5 mg daily today.

RTC 1 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-062539",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-062539",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
