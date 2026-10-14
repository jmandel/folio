---
folio: "0.1"
id: "01GH9XWAZ04CWSKE805RQGR354"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00110420"
effective: "2022-11-07T10:15:00-06:00"
recorded: "2022-11-07T14:53:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no complaints.

BP 131/76, pulse 72, wt 260 lb.
11/3 labs: eGFR 68, K 4.4, LDL 63.

Wt down a bit from last year, encouraged to keep it up. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-110758",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-110758",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-110758",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
