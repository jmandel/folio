---
folio: "0.1"
id: "01HSVMRT4005V72Q5DR37RSWNM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2024-03-25T12:40:00-05:00"
recorded: "2024-03-25T15:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 147/87, repeat 143/86, pulse 85, wt 197 lb.
Today: eGFR 62, K 4.5, UACR 136 mg/g, A1c 7.4%.
BP above goal, chlorthalidone started 12.5 mg daily today. Pt understands.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-032579",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-032579",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-032579",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
