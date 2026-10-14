---
folio: "0.1"
id: "01FKPAPHF0Z7ENSW1TGJCMZVQC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2021-11-04T12:37:00-05:00"
recorded: "2021-11-04T15:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt reports vomiting and not keeping much down.
Poor oral intake, trying small sips of fluids.
Metformin held today (vomiting, poor oral intake); review 11/11.
Call back or go to ED if unable to keep fluids down or feels worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110493",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
