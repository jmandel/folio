---
folio: "0.1"
id: "01G36HNC20FEW38EKVX96P0SRH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00060786"
effective: "2022-05-16"
recorded: "2022-05-16T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 5/2020 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10952",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2020-05-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2022-051612"
  }
}
```
