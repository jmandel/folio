---
folio: "0.1"
id: "01K5HEGQV0X2KR2X1AW7YD6DNT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00302644"
effective: "2025-09-19T08:15:00-05:00"
recorded: "2025-09-19T11:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 145/87, pulse 88, wt 206 lb.
eGFR 80, K 4.5, UACR 63 mg/g, A1c 7.9%, LDL 109 mg/dL.
BP above goal: lisinopril dose changed to 20 mg daily today.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091991",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091991",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-091991",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
