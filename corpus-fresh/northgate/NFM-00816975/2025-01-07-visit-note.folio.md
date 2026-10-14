---
folio: "0.1"
id: "01JH1X53H0BK9XA59JH6W2VZBW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2025-01-07T14:46:00-06:00"
recorded: "2025-01-07T20:51:00-06:00"
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
Metformin held today (vomiting, poor oral intake); review 1/14.
Advised fluids as tolerated and to call back if worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-010789",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
