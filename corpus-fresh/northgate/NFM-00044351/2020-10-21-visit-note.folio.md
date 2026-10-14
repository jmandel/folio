---
folio: "0.1"
id: "01EN6Z9960FYFVXWFYX5E97KB3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2020-10-21T15:30:00-05:00"
recorded: "2020-10-21T20:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx of HTN, DM2 and obesity per pt.

BP 143/86, repeat 135/82. Pulse 70, wt 239 lb.

Labs 10/16: eGFR 74, K 4.7, UACR 10 mg/g, A1c 7.3%, LDL 140 mg/dL.

Problem list entered from pt history. Will review labs and plan at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-102192",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-102192",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
