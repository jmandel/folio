---
folio: "0.1"
id: "01K0YKR0W0MXANGBVEQZ7Q87K9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00409706"
effective: "2025-07-24T08:40:00-05:00"
recorded: "2025-07-24T11:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Pt reports no headaches or dizziness.
BP 129/79, pulse 69, wt 186 lb.
eGFR 67, K 4.3, LDL 159 mg/dL today.
Reviewed results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072473",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072473",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
