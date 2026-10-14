---
folio: "0.1"
id: "01HQ6ZS670880P7XRVTWWGMTGE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2024-02-21T12:00:00-06:00"
recorded: "2024-02-21T17:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 133/76, pulse 79, wt 228 lb.
Today: eGFR 69, K 4.2, UACR 65 mg/g, A1c 7.2%.
Reviewed results with pt, A1c a bit higher than last time.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022174",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-022174",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
