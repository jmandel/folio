---
folio: "0.1"
id: "01JXDVDQ00HRHSB6N7NV83N5KQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00549835"
effective: "2025-06-10T14:50:00-05:00"
recorded: "2025-06-10T16:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c up to 8.1% today.
BP 125/74, pulse 84, wt 187 lb. eGFR 68, K 4.1.
Metformin dose changed to 1000 mg twice daily today given A1c 8.1.
Reviewed diet with pt. Recheck A1c in 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-061042",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-061042",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
