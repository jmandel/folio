---
folio: "0.1"
id: "01HZQ7Y870C42RAKR0JSTT8A7Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813593"
effective: "2024-06-06T09:30:00-05:00"
recorded: "2024-06-06T12:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 130/79, pulse 67, wt 223 lb.
eGFR 62, K 4.6, UACR 34 mg/g, A1c 8.2%, LDL 157 mg/dL today.
A1c up, metformin dose changed to 1000 mg twice daily today (A1c 8.2).
RTC 3-4 mo, repeat A1c.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-060645",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-060645",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-060645",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
