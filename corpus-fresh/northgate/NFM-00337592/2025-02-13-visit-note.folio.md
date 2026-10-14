---
folio: "0.1"
id: "01JM054AX0CGE647SZ7XZD903D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337592"
effective: "2025-02-13T09:26:00-06:00"
recorded: "2025-02-13T11:19:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt sick with vomiting, poor oral intake.
Metformin held today (vomiting, poor oral intake). Review 2/20.
Advised small sips of fluids. Call back or go to ED if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-021386",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
