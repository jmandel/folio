---
folio: "0.1"
id: "01KS0VYREGG1JSHM930XWH7H0Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00115624"
effective: "2026-05-19T14:38:00-05:00"
recorded: "2026-05-19T14:38:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6.1 confirmed on repeat. Losartan 100 mg QD held today.</ref> Review 6/2.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-24508",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.1 confirmed on repeat",
    "review_on": "2026-06-02",
    "visit_id": "V-2026-051943"
  }
}
```
