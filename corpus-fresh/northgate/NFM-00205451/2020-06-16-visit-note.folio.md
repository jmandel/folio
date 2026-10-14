---
folio: "0.1"
id: "01EAZEKT50K204JVDWXVP1DS1P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2020-06-16T12:28:00-05:00"
recorded: "2020-06-16T15:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt feeling better, vomiting resolved.
Eating and drinking normally.
Losartan resumed today (eating and drinking normally).
Call if symptoms return.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061695",
    "visit_type": "phone",
    "reason": "Phone: feeling better"
  }
}
```
