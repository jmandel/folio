---
folio: "0.1"
id: "01H3ADRBZ0Y0M89WCHADQ2WAR5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00158160"
effective: "2023-06-19T08:15:00-05:00"
recorded: "2023-06-19T13:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 145/82, repeat 137/79. Pulse 88, wt 202 lb.
Labs today: eGFR 49, K 4.9, A1c 8.3%, LDL 64.
Dapagliflozin started 10 mg daily today (A1c 8.3, CKD).
Hx reviewed with pt. Will recheck at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-061988",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-061988",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-061988",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
