---
folio: "0.1"
id: "01GHCFFDN0A607TGJF1ZM8FPE5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00984511"
effective: "2022-11-08T10:30:00-06:00"
recorded: "2022-11-08T14:39:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 154/98, repeat 151/95. Pulse 74, wt 233 lb.

Labs 11/5: eGFR 97, K 4.5, LDL 94 mg/dL.

Problem list updated from pt history. Will recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-110852",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-110852",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
