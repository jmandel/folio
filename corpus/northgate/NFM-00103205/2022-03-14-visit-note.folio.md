---
folio: "0.1"
id: "01FY5H9WE0XZRPGV77D530NMCW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2022-03-14T14:10:00-05:00"
recorded: "2022-03-14T19:58:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 136/90, pulse 75, wt 205 lb. BP a bit high today.
Labs 3/12: eGFR 69, K 4, UACR 299 mg/g, A1c 7.2%, LDL 114 mg/dL.
Reviewed with pt. Will recheck BP next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-031425",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-031425",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
