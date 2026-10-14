---
folio: "0.1"
id: "01HCMY2T00GJH1GKB1N0GV0NJG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00874391"
effective: "2023-10-13T08:10:00-05:00"
recorded: "2023-10-13T11:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 155/85, pulse 86, wt 153 lb.

Labs 10/11: eGFR 48, K 4.4, A1c 6.1%.

BP above goal, chlorthalidone started 12.5 mg daily today.

RTC 3 mo for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101312",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101312",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-101312",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
