---
folio: "0.1"
id: "01F1DCSRJ098AWAZ748J133EW0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00534138"
effective: "2021-03-22T08:10:00-05:00"
recorded: "2021-03-22T11:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 148/90, pulse 67, wt 191 lb.
eGFR 63 and K 4.2 today.
BP above goal, so chlorthalidone started 12.5 mg daily today.
Pt to check BP at home. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-032251",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-032251",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-032251",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
