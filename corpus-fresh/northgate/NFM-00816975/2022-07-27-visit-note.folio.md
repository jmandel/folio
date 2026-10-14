---
folio: "0.1"
id: "01G90WYJA0HCBBVSVSQC0Z5VF1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2022-07-27T14:45:00-05:00"
recorded: "2022-07-27T17:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 137/79, pulse 76, wt 227 lb.
Labs 7/25: eGFR 64, K 4.1, A1c 7.8%.
Pt has no new complaints. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072787",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072787",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
