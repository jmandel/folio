---
folio: "0.1"
id: "01JC11DN6R409K27G5X55DDNYW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00144865"
effective: "2024-11-06T09:25:00-06:00"
recorded: "2024-11-06T09:27:51-06:00"
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
    "med_id": "ML-20708",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Adeyemi) 10/28/2024"
  }
}
```
