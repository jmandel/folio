---
folio: "0.1"
id: "01DWWT2X20D3NDN01SFN1NRKE8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2019-12-24T11:00:00-06:00"
recorded: "2019-12-24T14:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 131/77, pulse 80, wt 176 lb.
Labs today: eGFR 73, K 4.2, A1c 7.3%.
Lisinopril stopped today (dry cough), lisinopril intolerance: dry cough.
Losartan started 50 mg daily today (ACE inhibitor cough).
Recheck BMP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-122496",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-122496",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-122496",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2019-122496",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
