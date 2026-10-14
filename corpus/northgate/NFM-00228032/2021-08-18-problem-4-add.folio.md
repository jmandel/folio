---
folio: "0.1"
id: "01FDD53QM0KHD9J4KF5A13ZCBE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00228032"
effective: "2021-08-18"
recorded: "2021-08-18T12:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18128",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2006-06-01", "precision": "month" },
    "visit_id": "V-2021-081892"
  }
}
```
