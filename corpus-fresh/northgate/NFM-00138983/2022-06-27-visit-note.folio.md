---
folio: "0.1"
id: "01G6K3D1E03QPF4FK0G6MAKFBE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00138983"
effective: "2022-06-27T08:50:00-05:00"
recorded: "2022-06-27T12:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 112/69, pulse 72, wt 150 lb.
Labs today: eGFR 84, K 4.7, LDL 102 mg/dL.
Pt has no new complaints. Records to be requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-062799",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-062799",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
