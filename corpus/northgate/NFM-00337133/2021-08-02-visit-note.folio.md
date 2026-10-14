---
folio: "0.1"
id: "01FC4XPTV05W8R5XKFJFNM0KBB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2021-08-02T15:15:00-05:00"
recorded: "2021-08-02T21:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 130/72, pulse 88, wt 171 lb.
Labs 7/31: eGFR 91, K 4.5, UACR 7 mg/g, A1c 7.4%, LDL 140 mg/dL.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-080284",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-080284",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
