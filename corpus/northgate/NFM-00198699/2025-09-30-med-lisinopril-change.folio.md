---
folio: "0.1"
id: "01K6DDQ1FGE863F681884KZPEN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00198699"
effective: "2025-09-30T08:41:00-05:00"
recorded: "2025-09-30T08:41:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">BP above goal. Lisinopril increased to 40 mg daily.</ref> Pt informed at visit.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13397",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "lisinopril 40 MG Oral Tablet", "rxnorm": "197884" },
    "dose": { "value": 40, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2025-093033"
  }
}
```
