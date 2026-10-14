---
folio: "0.1"
id: "01HJM26R50S6HEVQGMD41X36RT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00211240"
effective: "2023-12-26T11:20:00-06:00"
recorded: "2023-12-26T15:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Records and labs from 12/22 reviewed.
BP 138/91, pulse 65, wt 195 lb.
eGFR 36, K 4.7, UACR 45 mg/g, LDL 137 mg/dL (all 12/22).
Problem list entered from pt history. Referral to nephrology placed today.
Discussed home BP checks. RTC for BP f/u.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-122658",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-122658",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
