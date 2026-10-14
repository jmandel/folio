---
folio: "0.1"
id: "01FJ30JY10ZXVZE7B0TBRFYHY4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00767475"
effective: "2021-10-15T12:20:00-05:00"
recorded: "2021-10-15T17:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt reports dry cough.
BP 113/69, pulse 85, wt 195 lb.
eGFR 64, K 4.4 today.
Lisinopril: stopped today (dry cough). Lisinopril intolerance: dry cough.
Losartan: started 50 mg daily today (ACE inhibitor cough).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101541",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101541",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
