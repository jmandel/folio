---
folio: "0.1"
id: "01KHSK0VT067VR3SVTRA4A33MB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00479771"
effective: "2026-02-18T12:40:00-06:00"
recorded: "2026-02-18T17:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new complaints.

BP 127/73, pulse 82, wt 221 lb.
Labs 2/12: eGFR 76, K 4.2.
Reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021835",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021835",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
