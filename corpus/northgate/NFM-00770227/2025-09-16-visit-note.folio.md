---
folio: "0.1"
id: "01K59WRH80ZC041AS834PPMWW2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770227"
effective: "2025-09-16T10:10:00-05:00"
recorded: "2025-09-16T13:32:00-05:00"
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
BP 128/75, pulse 88, wt 155 lb.
Labs 9/10: eGFR 84, K 4.3, A1c 7.3%, UACR 118 mg/g.
Will recheck UACR at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091621",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091621",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
