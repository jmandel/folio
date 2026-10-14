---
folio: "0.1"
id: "01J9KPRV70YFT1VKAS59M0X2TB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084998"
effective: "2024-10-07T09:40:00-05:00"
recorded: "2024-10-07T09:40:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---

```json payload
{
  "review": {
    "type": "list_reviewed",
    "list": "medications",
    "lines_on_list": ["ML-35770", "ML-17299", "ML-47303", "ML-27539", "ML-45576", "ML-22165", "ML-44930", "ML-38153"],
    "visit_id": "V-2024-100787"
  }
}
```
