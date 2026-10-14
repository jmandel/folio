---
folio: "0.1"
id: "01K5YZ5B60Q6D5X5JMZG17MKHG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743670"
effective: "2025-09-24T14:40:00-05:00"
recorded: "2025-09-24T17:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. No new complaints.
BP 121/74, pulse 73, wt 213 lb.
Labs 9/20: eGFR 87, LDL 68 mg/dL. Reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092433",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092433",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
