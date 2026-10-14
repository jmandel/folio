---
folio: "0.1"
id: "01HB9F1VY0BCTMXK3KW5T7JRM6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230108"
effective: "2023-09-26"
recorded: "2023-09-26T14:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 4/22/2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19473",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2019-04-22", "precision": "day" },
    "visit_id": "V-2023-092616"
  }
}
```
