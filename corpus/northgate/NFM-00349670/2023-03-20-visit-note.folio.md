---
folio: "0.1"
id: "01GVZSXGM0D8STZR689K0R0VQ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00349670"
effective: "2023-03-20T08:45:00-05:00"
recorded: "2023-03-20T10:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no new complaints.
BP 134/80, pulse 83, wt 173 lb.
3/14 labs: eGFR 57, K 4.4, UACR 420 mg/g, A1c 7.3%.
CKD stage 3a reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-032061",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-032061",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-032061",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
