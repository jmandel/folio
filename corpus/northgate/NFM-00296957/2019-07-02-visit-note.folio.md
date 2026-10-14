---
folio: "0.1"
id: "01DETADME0QJCY5VAAYHYWN709"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2019-07-02T11:45:00-05:00"
recorded: "2019-07-02T16:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 132/85, pulse 81, wt 177 lb.
Labs today: eGFR 72, K 4.1, A1c 7.8%, LDL 81.
Records to be requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-070252",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-070252",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
