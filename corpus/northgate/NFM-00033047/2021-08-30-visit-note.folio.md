---
folio: "0.1"
id: "01FED08MX0G8180KC8RGJ4HY81"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2021-08-30T15:45:00-05:00"
recorded: "2021-08-30T21:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no new sx.
BP 132/78, pulse 77, wt 196 lb.
Labs 8/28: eGFR 66, K 3.9, UACR 87 mg/g, A1c 7.1%.
Pt pleased with A1c. Encouraged to keep up walking.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-083082",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-083082",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
