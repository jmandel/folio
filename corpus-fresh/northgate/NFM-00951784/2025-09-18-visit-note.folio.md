---
folio: "0.1"
id: "01K5FQBKF0VXCX9JPXYN40V2HF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00951784"
effective: "2025-09-18T13:46:00-05:00"
recorded: "2025-09-18T19:53:00-05:00"
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
Metformin held today (vomiting, poor oral intake); review 9/25.
Advised to keep sipping fluids and call if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091866",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
