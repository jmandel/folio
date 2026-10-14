---
folio: "0.1"
id: "01E0ZSC020GSWWQWHM16MNB7DD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2020-02-13T09:45:00-06:00"
recorded: "2020-02-13T11:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Feeling well.
BP 134/83, pulse 62, wt 223 lb.
eGFR 72, K 4.4, UACR 18 mg/g, A1c 6.4% today.
Stable, no changes today. Diet and activity reviewed.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-021361",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-021361",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
