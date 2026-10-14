---
folio: "0.1"
id: "01GHXZ82QGYJN95CP20TQZBCJP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00099884"
effective: "2022-11-15T09:41:00-06:00"
recorded: "2022-11-15T09:41:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c above goal. Dapagliflozin 10 mg daily started today.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-43073",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "dapagliflozin 10 MG Oral Tablet", "rxnorm": "1488569" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c above goal",
    "visit_id": "V-2022-111581"
  }
}
```
