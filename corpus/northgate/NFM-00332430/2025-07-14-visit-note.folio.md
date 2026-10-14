---
folio: "0.1"
id: "01K055E970NZ38GY31YCAHYX72"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00332430"
effective: "2025-07-14T11:23:00-05:00"
recorded: "2025-07-14T14:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, not keeping much down.

Metformin held today (vomiting, poor oral intake); review 7/21.

Advised to sip fluids and call back if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071491",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
