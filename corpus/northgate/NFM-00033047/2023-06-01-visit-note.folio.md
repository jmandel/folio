---
folio: "0.1"
id: "01H1W6HRY0DRJATQHXPQ5WNNAR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2023-06-01T08:45:00-05:00"
recorded: "2023-06-01T14:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new sx.
BP 136/81, pulse 74, wt 198 lb.
Today: eGFR 66, K 4.3, UACR 152 mg/g, A1c 7.8%.
UACR up from last. Discussed with pt, will recheck.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-060129",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-060129",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
