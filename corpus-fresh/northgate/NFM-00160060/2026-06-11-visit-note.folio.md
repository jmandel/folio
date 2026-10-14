---
folio: "0.1"
id: "01KTWP1XJ0DR5C7JX8SCN0F3D9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2026-06-11T14:30:00-05:00"
recorded: "2026-06-11T20:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new symptoms.
BP 143/90, pulse 65, wt 230 lb.
eGFR 64, K 4.3 today.
BP above goal today. Home BP log discussed.
RTC 4 wk for recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-061129",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-061129",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-061129",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
