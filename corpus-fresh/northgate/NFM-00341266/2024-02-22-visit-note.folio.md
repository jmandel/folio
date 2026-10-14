---
folio: "0.1"
id: "01HQ93W4S0439QKZ0N848DDGAJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2024-02-22T11:40:00-06:00"
recorded: "2024-02-22T13:15:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.
BP 127/74, pulse 84, wt 190 lb.
2/18 labs: A1c 7%, eGFR 55, K 4.5, UACR 360 mg/g.
A1c improved. Urine albumin still high, will keep following.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-022223",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-022223",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
