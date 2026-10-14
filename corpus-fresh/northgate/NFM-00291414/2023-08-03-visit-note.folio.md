---
folio: "0.1"
id: "01H6YBH4J0R1VK80K50QB9GXC2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2023-08-03T11:10:00-05:00"
recorded: "2023-08-03T13:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well.
BP 135/75, pulse 78, wt 161 lb.
Labs 7/30: eGFR 64, UACR 17 mg/g, A1c 7.9%, LDL 136 mg/dL. K 5.9 was hemolyzed, repeat K 4.6.
Hemolyzed K not real, repeat normal.
RTC 5-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-080325",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-080325",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
