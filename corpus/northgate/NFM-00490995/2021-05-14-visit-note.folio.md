---
folio: "0.1"
id: "01F5NWS5202PR8BKHY1ZPRJ2TE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490995"
effective: "2021-05-14T10:20:00-05:00"
recorded: "2021-05-14T11:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well.
BP 141/87, repeat 138/85, pulse 66, wt 204 lb.
eGFR 72, K 4.8, A1c 6.6%, LDL 83 mg/dL today.
BP above goal, lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051499",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-051499",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-051499",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
