---
folio: "0.1"
id: "01FHR31CH0A90BR5EAHZ0NSJ3A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2021-10-11T11:30:00-05:00"
recorded: "2021-10-11T11:30:12-05:00"
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
    "list": "problems",
    "lines_on_list": ["PL-14847", "PL-12450", "PL-11426"],
    "visit_id": "V-2021-101168"
  }
}
```
