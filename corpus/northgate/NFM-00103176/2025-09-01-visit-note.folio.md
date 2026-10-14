---
folio: "0.1"
id: "01K43D8JJ02EPQ7GEHRR5KE1R3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103176"
effective: "2025-09-01T11:10:00-05:00"
recorded: "2025-09-01T14:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 137/84, pulse 73, wt 171 lb.

Labs 8/29: eGFR 93, K 4.2, A1c 7.8%, LDL 79 mg/dL.

Lisinopril: stopped today (dry cough). Losartan: started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-090178",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-090178",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
