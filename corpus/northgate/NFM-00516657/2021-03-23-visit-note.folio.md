---
folio: "0.1"
id: "01F1G3HMP07KCXZSNXBMFM49NX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00516657"
effective: "2021-03-23T10:57:00-05:00"
recorded: "2021-03-23T12:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

lisinopril: held today (vomiting, poor oral intake); review 2021-03-30

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-032362",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
