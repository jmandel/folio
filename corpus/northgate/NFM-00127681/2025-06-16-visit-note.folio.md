---
folio: "0.1"
id: "01JXXBPEK0C4CWQ272GX2J8MZG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00127681"
effective: "2025-06-16T13:10:00-05:00"
recorded: "2025-06-16T16:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c 8.4, metformin dose changed to 1000 mg twice daily today.
BP 140/83, repeat 138/80. Pulse 76, wt 183 lb.
BP above goal, chlorthalidone started 12.5 mg daily today.
Pt voiced understanding of both changes.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061666",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061666",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
