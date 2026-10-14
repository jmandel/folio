---
folio: "0.1"
id: "01J42B0AV0W4PN3Q5RKSTKWTAK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00861057"
effective: "2024-07-30T08:30:00-05:00"
recorded: "2024-07-30T12:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. No headache or chest pain.
BP 144/93, pulse 72, wt 164 lb.
eGFR 71, K 4.5 today.
BP still above goal. Reviewed home readings, salt and activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-073075",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-073075",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
