---
folio: "0.1"
id: "01H1M4DKQRHH19F78BKXHEQXHJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00768389"
effective: "2023-05-29T11:08:00-05:00"
recorded: "2023-05-29T11:10:51-05:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added from the Lakeview record.</ref> Confirmed by phone with pt.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-22035",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Adeyemi) 5/23/2023"
  }
}
```
