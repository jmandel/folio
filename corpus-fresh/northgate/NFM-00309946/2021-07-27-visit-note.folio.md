---
folio: "0.1"
id: "01FBMCDJN03HFBNJ5AYTNF898N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00309946"
effective: "2021-07-27T08:50:00-05:00"
recorded: "2021-07-27T11:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 151/87, repeat 147/84, pulse 77, wt 119 lb.
Labs 7/21: eGFR 63, K 4.7, UACR 77 mg/g, A1c 6.6%.
Dry cough, lisinopril intolerance noted. Lisinopril stopped today (dry cough).
Losartan started 50 mg daily today for the ACE inhibitor cough.
RTC 3 mo for BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-072777",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-072777",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-072777",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
