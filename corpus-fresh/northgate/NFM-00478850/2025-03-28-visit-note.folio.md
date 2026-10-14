---
folio: "0.1"
id: "01JQFQ20C0Z7Z1YQV1J154QH8D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2025-03-28T14:10:00-05:00"
recorded: "2025-03-28T20:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call re high potassium. K 6.2 today, repeat also 6.2.
Pt has no new complaints by phone.
Lisinopril held today (K 6.2 confirmed on repeat), review 4/11.
Pt agrees with plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-032891",
    "visit_type": "phone",
    "reason": "Phone: high potassium"
  }
}
```
