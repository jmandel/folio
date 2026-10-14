---
folio: "0.1"
id: "01KET797B0XJDYB96Y0AAXX50Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2026-01-12T10:50:00-06:00"
recorded: "2026-01-12T17:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 142/89, repeat 136/86, pulse 83, wt 202 lb.
Labs 1/10: eGFR 63, K 4.3, LDL 84 mg/dL.

Repeat BP improved. Pt to keep home BP log. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-011288",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-011288",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
