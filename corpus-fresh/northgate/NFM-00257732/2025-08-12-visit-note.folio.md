---
folio: "0.1"
id: "01K2G73A30D6XM9GAGTTPFGD9N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2025-08-12T14:20:00-05:00"
recorded: "2025-08-12T17:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels fine, no new symptoms.
BP 110/63, pulse 79, wt 167 lb.
eGFR 44. Metformin changed to 500 mg twice daily today.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-081297",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-081297",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
