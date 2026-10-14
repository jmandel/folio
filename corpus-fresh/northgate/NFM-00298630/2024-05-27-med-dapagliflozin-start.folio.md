---
folio: "0.1"
id: "01HYXX7ACGJS4GAKG93YC143QS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00298630"
effective: "2024-05-27T15:52:00-05:00"
recorded: "2024-05-27T15:52:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Dapagliflozin 10 mg daily started today for HFrEF.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-18440",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "HFrEF",
    "visit_id": "V-2024-052795"
  }
}
```
