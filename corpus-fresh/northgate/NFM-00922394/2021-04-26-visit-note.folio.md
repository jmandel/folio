---
folio: "0.1"
id: "01F47BYY90ZK65Q4YGWD8QZ8M9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2021-04-26T08:20:00-05:00"
recorded: "2021-04-26T10:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels fine.

BP 152/91, repeat 147/87, pulse 67, wt 154 lb.
Today: eGFR 69, UACR 93 mg/g, A1c 7.9%. First K came back 6.2 but sample hemolyzed; repeat K 4.2.

BP above goal. Lisinopril dose changed to 40 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-042627",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-042627",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-042627",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
