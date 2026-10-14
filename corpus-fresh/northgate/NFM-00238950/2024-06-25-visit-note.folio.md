---
folio: "0.1"
id: "01J18BKTR0FM6WYXJ595SWH6E7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00238950"
effective: "2024-06-25T08:00:00-05:00"
recorded: "2024-06-25T13:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well.
BP 141/82, pulse 78, wt 212 lb.
eGFR 84, K 4.2, A1c 7.5%, LDL 78 mg/dL today.
BP a bit up, will recheck next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-062591",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-062591",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
