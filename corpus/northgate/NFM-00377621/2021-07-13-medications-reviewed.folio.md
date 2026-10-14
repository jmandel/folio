---
folio: "0.1"
id: "01FAGK91N0FCMAQBFS2Q90C2JX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2021-07-13T13:50:00-05:00"
recorded: "2021-07-13T13:50:12-05:00"
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
    "lines_on_list": ["ML-10179", "ML-36830", "ML-20320"],
    "visit_id": "V-2021-071332"
  }
}
```
