---
folio: "0.1"
id: "01ESSBT2A0R7X4092NS1ZRGGN9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2020-12-17T10:40:00-06:00"
recorded: "2020-12-17T16:06:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 145/94, repeat 140/90, pulse 71, wt 160 lb.
Today: eGFR 69, K 4.3, A1c 7.2%.
BP still above goal on repeat. Home BP log to be kept, bring to next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-121783",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-121783",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-121783",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
