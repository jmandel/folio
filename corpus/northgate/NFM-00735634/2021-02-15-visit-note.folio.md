---
folio: "0.1"
id: "01EYKF60W0ES74X215CWZA2169"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2021-02-15T10:30:00-06:00"
recorded: "2021-02-15T12:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 158/97, repeat 156/95, pulse 75, wt 207 lb.

eGFR 48, K 5, A1c 7.7%, LDL 93 mg/dL today.

BP above goal. Chlorthalidone started 12.5 mg daily today.

Recheck labs and BP in 4 wks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-021559",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-021559",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-021559",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-021559",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
