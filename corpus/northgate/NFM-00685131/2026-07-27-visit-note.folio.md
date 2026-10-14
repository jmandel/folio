---
folio: "0.1"
id: "01KYJG2SC0HB35BAZKHCW2128M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00685131"
effective: "2026-07-27T09:45:00-05:00"
recorded: "2026-07-27T14:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels okay, no new complaints.

BP 141/79, repeat 138/76, pulse 77, wt 224 lb.
Labs today: eGFR 55, K 4.4, LDL 175 mg/dL.

Results discussed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-072779",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-072779",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
