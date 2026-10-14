---
folio: "0.1"
id: "01M08KJG80800QNWKEQJ365FW4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00025136"
effective: "2026-08-17T11:30:00-05:00"
recorded: "2026-08-17T14:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Pt feels well.
BP 140/79, pulse 80, wt 209 lb.
Labs today: eGFR 64, K 4.4.
Chlorthalidone started 12.5 mg daily today (BP above goal).
Repeat BMP at next visit. RTC 4 wk.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-081728",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-081728",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-081728",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
