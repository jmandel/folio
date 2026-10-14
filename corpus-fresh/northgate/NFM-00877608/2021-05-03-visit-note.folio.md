---
folio: "0.1"
id: "01F4SYPXQ0G560TQAT79HVKHM3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00877608"
effective: "2021-05-03T10:15:00-05:00"
recorded: "2021-05-03T15:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Feels well, no complaints.
BP 139/87, pulse 72, wt 203 lb.
Labs 4/29: eGFR 65, A1c 7.1%, UACR 79 mg/g. K 5.9 but sample hemolyzed; repeat K 4.8.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-050333",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-050333",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
