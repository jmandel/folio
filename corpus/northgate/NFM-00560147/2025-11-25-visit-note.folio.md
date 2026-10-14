---
folio: "0.1"
id: "01KAYH9B20370N2ZVTMVJPSDXP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00560147"
effective: "2025-11-25T10:20:00-06:00"
recorded: "2025-11-25T16:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No new symptoms.
BP 150/81, repeat 145/81, pulse 63, wt 187 lb.
Labs 11/23: eGFR 77, K 4.5.
BP above goal today. Continue home BP log.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-112589",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-112589",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
