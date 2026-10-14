---
folio: "0.1"
id: "01HK38GWE063VNAHHYJ894HWX4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00897936"
effective: "2024-01-01T09:30:00-06:00"
recorded: "2024-01-01T13:38:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new complaints.

BP 126/79, pulse 84, wt 214 lb.
Labs 12/29/23: eGFR 69, K 4.5.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-010127",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-010127",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
