---
folio: "0.1"
id: "01H5N5ZMK0JSA8MRZGG4GXSP84"
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
    "list": "medications",
    "lines_on_list": ["ML-37310", "ML-38541", "ML-37919", "ML-16059"],
    "visit_id": "V-2023-071841"
  }
}
```
