---
folio: "0.1"
id: "01KHCMP6F0470F114AADF79BVG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2026-02-13T13:15:00-06:00"
recorded: "2026-02-13T17:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels fine.
BP 141/82, pulse 75, wt 213 lb.
Labs 2/10: eGFR 72, K 4.2, UACR 67 mg/g, A1c 7.6%, LDL 146 mg/dL.
BP above goal again today, will recheck at next visit. Reviewed labs with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021356",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021356",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
