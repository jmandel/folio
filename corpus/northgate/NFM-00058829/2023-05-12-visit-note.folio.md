---
folio: "0.1"
id: "01H0950TJ062JTJAWD2EMYFTQ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2023-05-12T15:30:00-05:00"
recorded: "2023-05-12T18:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt feels well.
BP 139/80, pulse 85, wt 230 lb.
Labs 5/9: eGFR 69, K 4.3, A1c 6.9%, LDL 144 mg/dL.
Results reviewed with pt, diet and exercise encouraged.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051267",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051267",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-051267",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
