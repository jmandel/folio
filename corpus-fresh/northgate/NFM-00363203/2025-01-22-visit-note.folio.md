---
folio: "0.1"
id: "01JJ83HXT0Q4KEZVWNMT21WBRW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2025-01-22T15:08:00-06:00"
recorded: "2025-01-22T16:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call re high potassium. K 5.6 on first check, 5.8 on repeat today.
No new symptoms reported by pt.
Lisinopril: held today (K 5.8 confirmed on repeat); review 2025-02-05.
Pt agrees with plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012278",
    "visit_type": "phone",
    "reason": "Phone: high potassium"
  }
}
```
