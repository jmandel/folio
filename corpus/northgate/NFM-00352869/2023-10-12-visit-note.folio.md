---
folio: "0.1"
id: "01HCJP8TV0Q0P687QSA9T1EAT4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00352869"
effective: "2023-10-12T10:10:00-05:00"
recorded: "2023-10-12T14:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 138/86, pulse 62, wt 233 lb.
Labs 10/6: eGFR 51, K 4.6, UACR 110 mg/g, A1c 7.8%, LDL 93.
Problem list entered from pt history.
RTC for DM2 f/u, will recheck labs then.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101263",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101263",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-101263",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
