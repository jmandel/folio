---
folio: "0.1"
id: "01JZ6Q8JM05R9DAEN8MCGB470B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00823780"
effective: "2025-07-02T15:27:00-05:00"
recorded: "2025-07-02T18:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Phone call re: high potassium. K 6.3 today, repeat K 5.9.

Pt reached by phone, no new symptoms reported.

Losartan resumed today (ACE inhibitor cough).

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-070277",
    "visit_type": "phone",
    "reason": "Phone: high potassium"
  }
}
```
