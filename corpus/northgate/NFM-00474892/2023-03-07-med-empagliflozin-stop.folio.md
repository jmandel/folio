---
folio: "0.1"
id: "01GTYXJ1CG0WFXZJPE4NMAV1M4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2023-03-07T14:52:00-06:00"
recorded: "2023-03-07T14:52:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Empagliflozin stopped today, euglycemic DKA.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-38187",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "euglycemic DKA",
    "visit_id": "V-2023-030739"
  }
}
```
