---
folio: "0.1"
id: "01KTPP6CQ0FSC1GG8KJTT42V86"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00615037"
effective: "2026-06-09T09:10:00-05:00"
recorded: "2026-06-09T12:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 149/92, repeat 147/91, pulse 84, wt 175 lb.
Labs today: eGFR 43, K 4.7, UACR 73 mg/g.
BP above goal. Amlodipine continued today.
Pt has no new complaints. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-060953",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-060953",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
