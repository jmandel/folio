---
folio: "0.1"
id: "01KHYRQKA0Z4SZ8EAY51SJYP0S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2026-02-20T14:40:00-06:00"
recorded: "2026-02-20T18:14:00-06:00"
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
BP 124/68, pulse 82, wt 160 lb.
Labs 2/16: eGFR 66, K 4.5, UACR 14 mg/g, A1c 7.9%, LDL 78 mg/dL.
Results reviewed with pt, no changes today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-022061",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-022061",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-022061",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
