---
folio: "0.1"
id: "01K5SSAYG03Q5567BWC6WXYTFE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2025-09-22T13:50:00-05:00"
recorded: "2025-09-22T17:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 136/84, pulse 77, wt 196 lb.
Labs today: eGFR 87, K 4.3, A1c 7.7%, UACR 230 mg/g.
A1c and UACR both up from May. Discussed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092237",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-092237",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-092237",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
