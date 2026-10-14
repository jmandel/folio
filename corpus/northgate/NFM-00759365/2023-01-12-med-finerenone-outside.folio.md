---
folio: "0.1"
id: "01GPK91RERESJW7M22CXZ51B2D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2023-01-12T09:17:00-06:00"
recorded: "2023-01-12T09:19:51-06:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added from Lakeview record.</ref> Reconciled by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-31489",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Adeyemi) 1/2/2023"
  }
}
```
