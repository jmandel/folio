---
folio: "0.1"
id: "01J88FJCS0YD7XT85BHMYTSQZ2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00439272"
effective: "2024-09-20T08:20:00-05:00"
recorded: "2024-09-20T14:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 141/81, repeat 138/79, pulse 80, wt 185 lb.

Labs today: eGFR 85, K 4.6, A1c 8.5%, LDL 109 mg/dL.

Metformin dose changed to 1000 mg twice daily today (A1c 8.5). Empagliflozin started 10 mg daily today (A1c above goal).

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-092024",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-092024",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
