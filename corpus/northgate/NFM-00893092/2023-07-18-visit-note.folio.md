---
folio: "0.1"
id: "01H5N5B4B0E6FGAARFJGA77B2P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00893092"
effective: "2023-07-18T09:30:00-05:00"
recorded: "2023-07-18T13:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 139/86, pulse 87, wt 151 lb.
Labs 7/12: eGFR 74, K 4.3.
Pt reports dry cough. Lisinopril stopped today (dry cough), logged as lisinopril intolerance: dry cough.
Losartan started 50 mg daily today (ACE inhibitor cough).
RTC 3 mo for BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-071866",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-071866",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-071866",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
