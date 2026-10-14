---
folio: "0.1"
id: "01D5Y70B20VPNPFAZGVW72H9R8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2019-03-14"
recorded: "2019-03-14T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2/2005 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10242",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2005-02-12", "precision": "day" },
    "visit_id": "V-2019-031462"
  }
}
```
