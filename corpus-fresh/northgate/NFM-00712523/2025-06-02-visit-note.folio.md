---
folio: "0.1"
id: "01JWSMN9V0D6GM77Z5J156F9TB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2025-06-02T15:52:00-05:00"
recorded: "2025-06-02T19:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call, pt sick with vomiting, poor oral intake.
Advised small sips of fluids and rest.
Metformin: held today (vomiting, poor oral intake); review 6/9.
Pt to call back or go to ED if unable to keep fluids down.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-060274",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
