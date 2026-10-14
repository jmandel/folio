---
folio: "0.1"
id: "01K2ZGQMT0YX8JY245GJA4Z0A0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00830635"
effective: "2025-08-18T12:40:00-05:00"
recorded: "2025-08-18T16:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well.
BP 137/81, pulse 84, wt 253 lb.
Labs today: eGFR 70, K 4.7, LDL 67 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-081834",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-081834",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
