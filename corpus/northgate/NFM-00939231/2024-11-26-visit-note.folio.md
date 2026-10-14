---
folio: "0.1"
id: "01JDMW2Q10J44CZXHPH9PCR717"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2024-11-26T09:45:00-06:00"
recorded: "2024-11-26T12:35:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call. Pt reports vomiting and not keeping much down.
Poor oral intake, trying small sips of fluids.
Metformin held today (vomiting, poor oral intake); review 12/3.
Call back or go to ED if unable to keep fluids down or feels worse.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112667",
    "visit_type": "phone",
    "reason": "Phone: sick, vomiting"
  }
}
```
