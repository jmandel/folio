---
folio: "0.1"
id: "01HFWB6H507402VVV18NH9WFJ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00570381"
effective: "2023-11-22T11:00:00-06:00"
recorded: "2023-11-22T14:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feeling well.
BP 134/80, pulse 68, wt 224 lb.
Labs today: eGFR 91, K 3.8, A1c 7.6%.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-112283",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-112283",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
