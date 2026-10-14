---
folio: "0.1"
id: "01M1HKF350XDS3ZX0XBEJDVJRK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2026-09-02T08:30:00-05:00"
recorded: "2026-09-02T12:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 143/84, repeat 135/83, pulse 71, wt 211 lb.
Today eGFR 68, K 4.3, A1c 7.9%.
BP above goal, so chlorthalidone started 12.5 mg daily today (BP above goal).
RTC 3 mo, BMP then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-090274",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-090274",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-090274",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
