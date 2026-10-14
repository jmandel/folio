---
folio: "0.1"
id: "01HN3SQA203HM5Y30BRPT7V41E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2024-01-26T12:10:00-06:00"
recorded: "2024-01-26T15:10:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new symptoms.
BP 141/80, repeat 139/77, pulse 69, wt 216 lb.
Labs 1/23: eGFR 50, K 4.4, A1c 8.1%.
Metformin dose changed to 1000 mg twice daily today (A1c 8.1). Chlorthalidone started 12.5 mg daily today (BP above goal).
Recheck BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012617",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012617",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-012617",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
