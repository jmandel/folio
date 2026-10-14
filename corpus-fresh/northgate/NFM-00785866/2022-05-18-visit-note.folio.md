---
folio: "0.1"
id: "01G3CJG10040P9MEVSPHDX1B7Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2022-05-18T14:40:00-05:00"
recorded: "2022-05-18T16:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. BP 141/88, repeat 137/86, pulse 80, wt 155 lb.

Labs 5/12: eGFR 50, K 4.5, A1c 8.9%, LDL 53.

Dulaglutide started 0.5 mg weekly today (A1c 8.9). Injection technique shown.

Records to be reviewed. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051863",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051863",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
