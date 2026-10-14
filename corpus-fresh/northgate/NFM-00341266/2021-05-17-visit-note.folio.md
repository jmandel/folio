---
folio: "0.1"
id: "01F5XYNQ30P8WCH897JHDS137F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2021-05-17T09:30:00-05:00"
recorded: "2021-05-17T15:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK, no complaints.
BP 126/83, pulse 67, wt 185 lb.
5/11 labs: A1c 8.2%, eGFR 58, K 4.2.
Started dulaglutide 0.5 mg weekly today for A1c 8.2. Injection technique reviewed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051769",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-051769",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
