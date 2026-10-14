---
folio: "0.1"
id: "01G8H3R630NP30VSK79FDDPA6Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103176"
effective: "2022-07-21T09:10:00-05:00"
recorded: "2022-07-21T14:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.

BP 151/93, repeat 145/89. Pulse 62, wt 175 lb.

Labs today: eGFR 92, K 4, UACR 300 mg/g, A1c 7.1%, LDL 79 mg/dL.

Problem list entered. Will review labs with pt at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-072113",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-072113",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
