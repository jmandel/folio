---
folio: "0.1"
id: "01JRKM1JW04D7YMCNR720X3RVV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2025-04-11T15:28:00-05:00"
recorded: "2025-04-11T18:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone: sick, vomiting.

metformin: held today (vomiting, poor oral intake); review 2025-04-18

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041129",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
