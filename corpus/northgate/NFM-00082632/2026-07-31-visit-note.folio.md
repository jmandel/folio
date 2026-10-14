---
folio: "0.1"
id: "01KYXAE5B0V339HRM3TSV67AGC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2026-07-31T15:20:00-05:00"
recorded: "2026-07-31T19:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 133/80, pulse 70, wt 197 lb.
Labs today: eGFR 86, K 4.1, A1c 7.5%, UACR 260 mg/g, LDL 70.
A1c improved from Feb. UACR higher again, discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-073197",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-073197",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-073197",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
