---
folio: "0.1"
id: "01KF1JXGD0VNT93R7D721KNMSN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00279297"
effective: "2026-01-15T11:00:00-06:00"
recorded: "2026-01-15T13:43:00-06:00"
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

BP 120/72, pulse 66, wt 184 lb.

Labs today: eGFR 69, K 4.5, LDL 115 mg/dL.

Results reviewed with pt. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-011557",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-011557",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
