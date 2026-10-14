---
folio: "0.1"
id: "01GKARD7C023F1FSPVZQCMVHT0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2022-12-02T15:00:00-06:00"
recorded: "2022-12-02T19:08:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 141/94, repeat 134/91, pulse 79, wt 220 lb.
Labs 11/28: eGFR 63, K 4.6, A1c 6.6%.
BP running higher than usual, will recheck next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-120258",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-120258",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
