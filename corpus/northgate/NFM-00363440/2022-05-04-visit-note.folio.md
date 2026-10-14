---
folio: "0.1"
id: "01G282970081G0CQTCXHWA7W4T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363440"
effective: "2022-05-04T09:00:00-05:00"
recorded: "2022-05-04T12:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. Feels well, no swelling or dizziness.
BP 140/82, pulse 63, wt 173 lb.
eGFR 95, K 4.9, LDL 83 mg/dL today.
BP above goal, amlodipine started 5 mg daily today.
Recheck BP in a few weeks.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-050418",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-050418",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
