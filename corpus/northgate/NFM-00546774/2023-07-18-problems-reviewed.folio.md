---
folio: "0.1"
id: "01H5N5ZMK0J7GSHNR5JQRBMXDN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00546774"
effective: "2023-07-18T14:00:00-05:00"
recorded: "2023-07-18T14:00:12-05:00"
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
    "list": "problems",
    "lines_on_list": ["PL-12634", "PL-17803", "PL-12741", "PL-18323", "PL-14250"],
    "visit_id": "V-2023-071841"
  }
}
```
