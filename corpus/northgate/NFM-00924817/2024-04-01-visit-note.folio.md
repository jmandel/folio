---
folio: "0.1"
id: "01HTDGGPW0WPB3BTXATRXWQASH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924817"
effective: "2024-04-01T12:00:00-05:00"
recorded: "2024-04-01T14:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well, no new symptoms.
BP 139/83, pulse 78, wt 243 lb.
Labs today: eGFR 91, K 4.4, LDL 104 mg/dL.
Results reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040116",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040116",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
