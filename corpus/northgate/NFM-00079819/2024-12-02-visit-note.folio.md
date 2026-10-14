---
folio: "0.1"
id: "01JE4Q5GV0ZP5FXNJEZ54VM176"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00079819"
effective: "2024-12-02T13:00:00-06:00"
recorded: "2024-12-02T16:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, but has had a dry cough on the lisinopril.
BP 141/88, repeat 136/85, pulse 83, wt 165 lb.
Labs 11/29: eGFR 93, K 4.6, A1c 6.3%.
Lisinopril stopped today (dry cough). Lisinopril intolerance: dry cough, added to allergy list.
Losartan started 50 mg daily today (ACE inhibitor cough).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120253",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-120253",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
