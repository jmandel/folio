---
folio: "0.1"
id: "01J4TBPQ90DFR7WTNPR9FN7YD1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00184341"
effective: "2024-08-08T15:20:00-05:00"
recorded: "2024-08-08T20:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 156/101, pulse 68, wt 213 lb.
eGFR 90 and K 4.5 on 8/2.
BP above goal, chlorthalidone 12.5 mg daily started today.
Pt to keep checking BP at home. RTC 1 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-080865",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-080865",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-080865",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
