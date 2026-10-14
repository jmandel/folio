---
folio: "0.1"
id: "01KTMBT0V07CPWYMYXV0XXF7QD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00228032"
effective: "2026-06-08T12:20:00-05:00"
recorded: "2026-06-08T14:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt feels OK, no new concerns.
BP 118/75, pulse 84, wt 201 lb.
Labs today: eGFR 63, K 3.8, UACR 11 mg/g, A1c 8%.
Went over results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-060854",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-060854",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
