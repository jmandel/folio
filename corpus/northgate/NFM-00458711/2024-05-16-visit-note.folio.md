---
folio: "0.1"
id: "01HY1AJEW0WK023GQ05NTC58NX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2024-05-16T09:15:00-05:00"
recorded: "2024-05-16T13:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and hyperlipidemia per pt.
BP 147/91, repeat 144/88, pulse 76, wt 189 lb.
Labs 5/10: eGFR 54, K 4.4, A1c 7.6%, LDL 97 mg/dL.
Reviewed labs with pt. Referring to nephrology. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-051663",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-051663",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-051663",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-051663",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
