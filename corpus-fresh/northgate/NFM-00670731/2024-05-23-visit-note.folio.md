---
folio: "0.1"
id: "01HYK8Q8J018K3X8W7PGHC0W66"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2024-05-23T10:40:00-05:00"
recorded: "2024-05-23T12:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new symptoms.
BP 128/75, pulse 66, wt 221 lb.
Labs today: eGFR 57, K 4.7, A1c 7.3%.
Reviewed results with pt.
RTC 4 to 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052371",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052371",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-052371",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
