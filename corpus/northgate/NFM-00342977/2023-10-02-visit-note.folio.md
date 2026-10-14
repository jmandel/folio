---
folio: "0.1"
id: "01HBRR07H05BVYT9KDVM5GD4BY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2023-10-02T11:15:00-05:00"
recorded: "2023-10-02T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Pt doing OK.
BP 131/84, pulse 69, wt 171 lb.
Labs today: eGFR 73, K 4.6, A1c 7.8%.
Reviewed results and home routine with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-100257",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-100257",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-100257",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
