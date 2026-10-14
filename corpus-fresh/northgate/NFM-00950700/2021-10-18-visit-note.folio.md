---
folio: "0.1"
id: "01FJA57TN0PN1Y1FNS118F4JRK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00950700"
effective: "2021-10-18T08:15:00-05:00"
recorded: "2021-10-18T11:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 141/79, pulse 75, wt 147 lb.
eGFR 71, K 4.6, A1c 7% today.
BP above goal, so chlorthalidone started 12.5 mg daily today.
Lisinopril stopped today for dry cough (lisinopril intolerance: dry cough). Losartan started 50 mg daily today for the ACE inhibitor cough.
BMP in 2 wks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101834",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101834",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-101834",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-101834",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
