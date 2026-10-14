---
folio: "0.1"
id: "01JQ7CX78GFXRRD6K5K0EJAK9E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2025-03-25T14:36:00-05:00"
recorded: "2025-03-25T14:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">A1c 8.3, CKD. Empagliflozin 10 mg daily started.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-49532",
    "action": "start",
    "origin": "northgate",
    "drug": { "name": "empagliflozin 10 MG Oral Tablet", "rxnorm": "1545658" },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "A1c 8.3, CKD",
    "visit_id": "V-2025-032551"
  }
}
```
