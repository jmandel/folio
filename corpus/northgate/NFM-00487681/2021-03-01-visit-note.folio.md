---
folio: "0.1"
id: "01EZQWBSD06986AWEW54NPKGJ6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00487681"
effective: "2021-03-01T10:50:00-06:00"
recorded: "2021-03-01T15:51:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.

BP 151/82, repeat 143/80, pulse 80, wt 205 lb.

Labs today: eGFR 68, K 3.9, UACR 68 mg/g, A1c 7.4%.

Discussed diet and activity. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-030143",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-030143",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-030143",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
