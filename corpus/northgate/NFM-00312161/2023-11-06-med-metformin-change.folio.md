---
folio: "0.1"
id: "01HEJSAE7GX1TQQD2QM9NYP739"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2023-11-06T11:01:00-06:00"
recorded: "2023-11-06T11:01:42-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">change metformin: eGFR 43.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-14097",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "metformin hydrochloride 500 MG Oral Tablet", "rxnorm": "861007" },
    "dose": { "value": 500, "unit": "mg" },
    "frequency": "BID",
    "sig": "Take 1 tablet by mouth twice daily with meals",
    "reason_text": "eGFR 43",
    "visit_id": "V-2023-110672"
  }
}
```
