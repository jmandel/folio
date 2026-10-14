---
folio: "0.1"
id: "01F3TVY1C0H0BEJDG6BM0TFAH9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2021-04-21T11:00:00-05:00"
recorded: "2021-04-21T13:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.
BP 139/92, pulse 76, wt 123 lb.
Labs 4/16: eGFR 42, K 4.4, A1c 6.4%, LDL 164 mg/dL.
Reviewed labs with pt. BP a bit high today, will recheck next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042192",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042192",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-042192",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
