---
folio: "0.1"
id: "01JSYVD5C0F4MRNZTFX5Y7WVTB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2025-04-28T08:40:00-05:00"
recorded: "2025-04-28T13:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 132/80, pulse 63, wt 187 lb.
Labs 4/25: eGFR 49, K 5, UACR 1467 mg/g, A1c 7.8%, LDL 123 mg/dL.
eGFR down and UACR up, reviewed with pt. Will recheck K next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-042834",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-042834",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
