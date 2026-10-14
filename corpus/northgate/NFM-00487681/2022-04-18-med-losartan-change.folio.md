---
folio: "0.1"
id: "01G0YN38RGQXB1EPQ65RJS9CZP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00487681"
effective: "2022-04-18T10:36:00-05:00"
recorded: "2022-04-18T10:36:42-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Losartan up to 100 mg daily, BP above goal.</ref> Pt informed.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-31339",
    "action": "change",
    "origin": "northgate",
    "drug": { "name": "losartan potassium 100 MG Oral Tablet", "rxnorm": "979480" },
    "dose": { "value": 100, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "BP above goal",
    "visit_id": "V-2022-041846"
  }
}
```
