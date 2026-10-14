---
folio: "0.1"
id: "01K8RFG940BVBXCBJ129A318GA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00228032"
effective: "2025-10-29T08:45:00-05:00"
recorded: "2025-10-29T12:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

metformin: dose changed to 1000 mg twice daily today (A1c 8.2)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-102947",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
