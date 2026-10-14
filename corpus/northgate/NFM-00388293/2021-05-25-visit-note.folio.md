---
folio: "0.1"
id: "01F6K6VF00ERV8GNB6GB72RMND"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2021-05-25T15:20:00-05:00"
recorded: "2021-05-25T21:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 130/78, pulse 68, wt 164 lb.
5/21 labs: eGFR 69, K 4, UACR 200 mg/g, A1c 8.1%, LDL 92.
Dapagliflozin started 10 mg daily today (A1c 8.1).
Lisinopril stopped today (dry cough); lisinopril intolerance: dry cough. Losartan started 50 mg daily today (ACE inhibitor cough).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-052577",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-052577",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
