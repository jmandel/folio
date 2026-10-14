---
folio: "0.1"
id: "01JF8RKXN0CM6NRR8N9774AYVA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2024-12-16T11:20:00-06:00"
recorded: "2024-12-16T16:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 127/74, pulse 63, wt 196 lb.
Labs today: eGFR 87, K 4.5, A1c 7.3%, UACR 194 mg/g.
A1c back down. UACR still elevated, discussed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-121615",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-121615",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-121615",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
