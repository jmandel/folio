---
folio: "0.1"
id: "01JTHC37E0SE9P8T7VRZKYTD74"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2025-05-05T12:30:00-05:00"
recorded: "2025-05-05T18:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes f/u.

BP 159/94, pulse 78, wt 123 lb.

Labs 5/2: eGFR 88, K 4.3, A1c 8.3%, LDL 83 mg/dL.

A1c 8.3, so metformin dose changed to 1000 mg twice daily today. BP above goal, chlorthalidone started 12.5 mg daily today.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-050572",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-050572",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-050572",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
