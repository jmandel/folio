---
folio: "0.1"
id: "01JBX7WRW0T1J7GXE1Q69DCN15"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00912291"
effective: "2024-11-04T15:50:00-06:00"
recorded: "2024-11-04T22:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records reviewed with pt, history as given by pt.
BP 141/85, repeat 133/81. Pulse 82, wt 151 lb.
Labs today: eGFR 97, K 4.1, A1c 7.9%.
Discussed diet and activity. Will recheck BP at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-110496",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-110496",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-110496",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
