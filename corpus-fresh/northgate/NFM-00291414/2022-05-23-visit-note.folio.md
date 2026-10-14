---
folio: "0.1"
id: "01G3S2VXF03J2R6REZRR6G5AG6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2022-05-23T08:45:00-05:00"
recorded: "2022-05-23T13:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 140/79, pulse 76, wt 168 lb.
eGFR 65, K 4.5, UACR 16 mg/g, A1c 7.7% today.
BP above goal. Losartan dose changed to 100 mg daily today.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-052396",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-052396",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
