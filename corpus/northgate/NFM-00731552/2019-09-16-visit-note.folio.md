---
folio: "0.1"
id: "01DMXGTWJ0505HCZYK5YCC5FS0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2019-09-16T09:40:00-05:00"
recorded: "2019-09-16T12:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Pt here for low mood over the past several weeks, sleeping poorly.
<ref id="dx_1">Dx recurrent mild depression (MDD); sertraline 100 mg daily started today.</ref>
BP 138/86, pulse 76, wt 189 lb.
Discussed what to expect and when to call.
RTC 4 wks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-091669",
    "visit_type": "office",
    "reason": "Low mood"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-091669",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-091669",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
