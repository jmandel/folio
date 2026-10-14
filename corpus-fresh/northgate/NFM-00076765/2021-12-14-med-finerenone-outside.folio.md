---
folio: "0.1"
id: "01FPXCH8VRTZWD98N0QJWPDEZ0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2021-12-14T15:08:00-06:00"
recorded: "2021-12-14T15:10:51-06:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added from Lakeview record.</ref> Confirmed with pt by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-21943",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Adeyemi) 12/3/2021"
  }
}
```
