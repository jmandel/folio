---
folio: "0.1"
id: "01JDK8ZJT0X3RMK00RKREE9XJY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900007"
effective: "2024-11-25T15:12:00-06:00"
recorded: "2024-11-25T21:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2024-12-02

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112589",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
