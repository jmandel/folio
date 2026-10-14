---
folio: "0.1"
id: "01H4PSGG30ZSW8QSP31HTNF947"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2023-07-06T13:13:00-05:00"
recorded: "2023-07-06T18:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting and not keeping much down.

Lisinopril: held today (vomiting, poor oral intake); review 7/13.

Advised fluids as tolerated. Pt to call if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-070672",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
