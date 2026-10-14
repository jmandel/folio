---
folio: "0.1"
id: "01JW71JAV0QYPWZ7JA01AW9A4A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00435097"
effective: "2025-05-26T09:10:00-05:00"
recorded: "2025-05-26T14:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 140/82, repeat 134/80, pulse 74, wt 232 lb.
Today: eGFR 96, K 4.6, A1c 7.2%.
Pt feels well, no new complaints. Diet and activity reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-052612",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-052612",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-052612",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
