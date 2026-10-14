---
folio: "0.1"
id: "01JA68PTM0E5984QA2ACVDPM9T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00753122"
effective: "2024-10-14T11:43:00-05:00"
recorded: "2024-10-14T14:40:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: feeling better.

lisinopril: resumed today (eating and drinking normally)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-101422",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
