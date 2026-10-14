---
folio: "0.1"
id: "01KP3YXBZ0P0N20KZKCN2SNFPZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2026-04-13T09:02:00-05:00"
recorded: "2026-04-13T12:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2026-04-20

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-041331",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
