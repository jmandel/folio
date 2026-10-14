---
folio: "0.1"
id: "01HWB2M9D04PQJK5E1H3HDY4K7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00805315"
effective: "2024-04-25T11:50:00-05:00"
recorded: "2024-04-25T11:50:12-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "lines_on_list": ["ML-27851", "ML-24520"],
    "visit_id": "V-2024-042546"
  }
}
```
