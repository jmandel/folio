---
folio: "0.1"
id: "01F3NENKG002DM191ES3F9FY6A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212854"
effective: "2021-04-19T09:45:00-05:00"
recorded: "2021-04-19T11:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 129/81, pulse 83, wt 200 lb.
4/15 labs: eGFR 61, A1c 7.2%, UACR 189 mg/g. K 6.4 was hemolyzed, repeat K 4.1.
Will keep following the UACR.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-041963",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-041963",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-041963",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
