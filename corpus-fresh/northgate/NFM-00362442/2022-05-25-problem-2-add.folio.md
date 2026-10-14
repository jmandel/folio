---
folio: "0.1"
id: "01G3Y4CZM0K7QQC1C2TT3ZWYYK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00362442"
effective: "2022-05-25"
recorded: "2022-05-25T12:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia since ~5/2020 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14647",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2020-05-01", "precision": "month" },
    "visit_id": "V-2022-052529"
  }
}
```
