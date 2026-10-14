---
folio: "0.1"
id: "01F3Y249T0QHVVEMPSA70TZYXB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2021-04-22T14:30:00-05:00"
recorded: "2021-04-22T19:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 148/89, repeat 142/86, pulse 75, wt 202 lb.
eGFR 66, K 4.1, LDL 112 mg/dL today.

BP above goal. Losartan started 50 mg daily today.
Recheck BP and labs at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042214",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042214",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-042214",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
