---
folio: "0.1"
id: "01HEKPVT60KAE79DC65BAD8DD8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00025136"
effective: "2023-11-06T13:15:00-06:00"
recorded: "2023-11-06T19:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt still bothered by dry cough.
BP 140/86, pulse 86, wt 208 lb. Labs 11/1: eGFR 65, K 4.7.
Lisinopril stopped today (dry cough). Losartan started 50 mg daily today (ACE inhibitor cough).
Lisinopril intolerance: dry cough, added to allergy list.
RTC for BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110697",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-110697",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-110697",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-110697",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
