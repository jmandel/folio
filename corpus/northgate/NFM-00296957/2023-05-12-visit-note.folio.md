---
folio: "0.1"
id: "01H08DYX90XDBPYMWKPZWBAF4Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2023-05-12T09:10:00-05:00"
recorded: "2023-05-12T11:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 115/69, pulse 79, wt 174 lb.
Labs today: A1c 7.3%, eGFR 64, K 4.3.
No complaints.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-051278",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-051278",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
