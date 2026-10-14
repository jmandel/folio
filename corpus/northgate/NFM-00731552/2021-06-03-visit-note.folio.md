---
folio: "0.1"
id: "01F79DMTJ04P7SG834YYP9VFC8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2021-06-03T10:00:00-05:00"
recorded: "2021-06-03T12:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Pt here with dry cough for a few months.
Lisinopril stopped today (dry cough). Lisinopril intolerance: dry cough. The lisinopril reaction was cough only: no lip, tongue or throat swelling.
Losartan started 50 mg daily today (ACE inhibitor cough).
BP 136/84, pulse 74, wt 188 lb.
Recheck labs in a few months.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-060317",
    "visit_type": "office",
    "reason": "Cough"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-060317",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
