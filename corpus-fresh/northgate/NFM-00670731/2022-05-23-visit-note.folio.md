---
folio: "0.1"
id: "01G3RS89Q0CG6R2GPYYEHGVFNT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2022-05-23T08:00:00-05:00"
recorded: "2022-05-23T10:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints.
BP 137/95, pulse 78, wt 222 lb.
Labs today: eGFR 60, K 4.4, A1c 6.5%, LDL 97 mg/dL.
Reviewed results with pt, BP still high-ish today.
RTC 3 to 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052324",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052324",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
