---
folio: "0.1"
id: "01GR7KV5Q0YNWKS15HR5WFRQFN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2023-02-01T13:20:00-06:00"
recorded: "2023-02-01T17:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No hypoglycemia, no new symptoms.
BP 135/79, pulse 82, wt 203 lb.
Labs 1/26: eGFR 67, K 4.3, A1c 7%.
Reviewed results with pt, A1c at goal.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020119",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020119",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
