---
folio: "0.1"
id: "01GE2VZG60254H7DMY2RCN3QJ5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2022-09-28T10:45:00-05:00"
recorded: "2022-09-28T15:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 150/88, pulse 88, wt 163 lb.
eGFR 66, K 4.3, UACR 19 mg/g, A1c 7.4% today.
BP still above goal. Amlodipine 5 mg daily started today.
Pt to check BP at home. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-092882",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-092882",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
