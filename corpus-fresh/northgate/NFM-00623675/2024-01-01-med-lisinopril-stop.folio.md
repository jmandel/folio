---
folio: "0.1"
id: "01HK3CP06G482JNF52YA9R6EHF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00623675"
effective: "2024-01-01T14:50:00-06:00"
recorded: "2024-01-01T14:50:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Lisinopril stopped today, AKI with hyperkalemia.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14479",
    "action": "stop",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "stop_reason": "adverse_reaction",
    "reason_text": "AKI with hyperkalemia",
    "visit_id": "V-2024-010182"
  }
}
```
