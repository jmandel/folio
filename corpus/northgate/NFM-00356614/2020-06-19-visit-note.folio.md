---
folio: "0.1"
id: "01EB6VSH80TS6BFC6ZYM60FGJA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2020-06-19T11:00:00-05:00"
recorded: "2020-06-19T13:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt c/o dry cough on lisinopril.
BP 140/85, repeat 136/82, pulse 69, wt 235 lb.
eGFR 64, K 4.4, UACR 189 mg/g, A1c 7.8% today.
Lisinopril stopped today (dry cough). Losartan started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough.
RTC 3 mo, BP recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061923",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-061923",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-061923",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
