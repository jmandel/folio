---
folio: "0.1"
id: "01JXKEPD70ABK8T8S49W95RQWG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00451037"
effective: "2025-06-12T14:38:00-05:00"
recorded: "2025-06-12T20:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and poor oral intake.
Lisinopril held today (vomiting, poor oral intake); review 6/19.
Pt to call if vomiting continues or can't keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061267",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
