---
folio: "0.1"
id: "01HB6BHCKRVYQV7RQZV1HGBMJP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00546774"
effective: "2023-09-25T09:20:00-05:00"
recorded: "2023-09-25T09:22:51-05:00"
author:
  id: "urn:northgate-fm.example:staff:kfoster"
  name: "Kim Foster, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added from the Lakeview record.</ref> Med list updated by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-44449",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Marsh) 9/18/2023"
  }
}
```
