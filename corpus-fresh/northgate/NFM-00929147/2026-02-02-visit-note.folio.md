---
folio: "0.1"
id: "01KGGD9GB0K7Q7XTR3DMY07Z95"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929147"
effective: "2026-02-02T14:56:00-06:00"
recorded: "2026-02-02T18:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call re high K. K 6.3 today, repeat 6.2.
Pt advised of the results by phone.
Losartan held today (K 6.3 confirmed on repeat); review 2/16.
Pt voiced understanding.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-020298",
    "visit_type": "phone",
    "reason": "Phone: high potassium"
  }
}
```
