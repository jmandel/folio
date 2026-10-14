---
folio: "0.1"
id: "01K3764FTGRMMHRXXK0DG9QFEQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2025-08-21T15:46:00-05:00"
recorded: "2025-08-21T15:46:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Spironolactone held today, K 6.2 confirmed on repeat. Review 9/4.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-33301",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "spironolactone 25 MG Oral Tablet", "rxnorm": "313096" },
    "dose": { "value": 25, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2025-09-04",
    "visit_id": "V-2025-082189"
  }
}
```
