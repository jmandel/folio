---
folio: "0.1"
id: "01GBRC3XZ0YZKRTEHSGRHSJNX1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2022-08-30T14:15:00-05:00"
recorded: "2022-08-30T16:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no complaints.
BP 129/81, pulse 85, wt 145 lb.
Labs 8/28: eGFR 85, K 4.3, UACR 83 mg/g, A1c 7.2%, LDL 134.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-083023",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-083023",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
