---
folio: "0.1"
id: "01KPP3ZQG039Y1YTEZ3BY8GAFG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850967"
effective: "2026-04-20T11:10:00-05:00"
recorded: "2026-04-20T13:56:00-05:00"
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
BP 136/76, pulse 85, wt 220 lb.
Labs today: eGFR 63, K 4.5, A1c 8.2%, LDL 102 mg/dL.
A1c still above goal. Insulin glargine started today, 10 units at bedtime. Pt taught injection and told to watch for low sugars.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-042033",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-042033",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
