---
folio: "0.1"
id: "01KP9FKNF0FMHV5SSFXNN9PDQ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00080015"
effective: "2026-04-15T10:40:00-05:00"
recorded: "2026-04-15T16:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no new complaints.
BP 124/72, pulse 78, wt 186 lb.
eGFR 89, K 4.4, UACR 158 mg/g, A1c 7.3% today.
BP at goal. A1c improved from last check.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-041544",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-041544",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-041544",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
