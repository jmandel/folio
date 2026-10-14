---
folio: "0.1"
id: "01HWDV87D0WY680T8EA9A1J4S9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00115624"
effective: "2024-04-26T10:00:00-05:00"
recorded: "2024-04-26T13:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt, problem list entered.
BP 133/76, pulse 80, wt 190 lb.
Labs today: eGFR 73, K 4.5, UACR 136 mg/g, A1c 7.1%, LDL 66 mg/dL.
Reviewed results with pt, questions answered.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-042655",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-042655",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
