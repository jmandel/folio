---
folio: "0.1"
id: "01DK7NMNS03KMAHET7H9CE96DA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2019-08-26T09:30:00-05:00"
recorded: "2019-08-26T14:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and hyperlipidemia per pt.

BP 150/89, repeat 146/85. Pulse 64, wt 204 lb.

Outside labs 8/24: eGFR 49, K 4.5, A1c 7%, LDL 88 mg/dL.

Problem list entered. Records reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-082618",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-082618",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
