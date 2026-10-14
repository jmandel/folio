---
folio: "0.1"
id: "01K5858DA02S0XF6CFA4RCXBA3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00034754"
effective: "2025-09-15T15:40:00-05:00"
recorded: "2025-09-15T21:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt reports a dry cough that has been bothersome.

BP 130/81, pulse 69, wt 208 lb. Labs today: eGFR 64, K 4.6, A1c 7.8%, LDL 97 mg/dL.

Lisinopril stopped today (dry cough). Losartan started 50 mg daily today (ACE inhibitor cough). Lisinopril intolerance: dry cough.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091522",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091522",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-091522",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
