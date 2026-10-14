---
folio: "0.1"
id: "01KNQEZJNGJPE1NWFS31928YSH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785866"
effective: "2026-04-08T16:11:00-05:00"
recorded: "2026-04-08T16:11:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">K 6.2 confirmed on repeat. Losartan held, review 4/22.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-41791",
    "action": "hold",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "K 6.2 confirmed on repeat",
    "review_on": "2026-04-22",
    "visit_id": "V-2026-040855"
  }
}
```
