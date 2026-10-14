---
folio: "0.1"
id: "01GTZ6V750XKCQXBZCEMSMSX1G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00549835"
effective: "2023-03-07T12:50:00-06:00"
recorded: "2023-03-07T17:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, problem list entered.
BP 127/73, pulse 83, wt 185 lb.
Labs today: A1c 7.3%, LDL 114 mg/dL, eGFR 69, K 3.8.
Reviewed results with pt. Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-030718",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-030718",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-030718",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
