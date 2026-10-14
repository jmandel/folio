---
folio: "0.1"
id: "01JHG63MDR02ZDEH4CTHAKZ0VE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2025-01-13T09:54:00-06:00"
recorded: "2025-01-13T09:56:51-06:00"
author:
  id: "urn:northgate-fm.example:staff:kfoster"
  name: "Kim Foster, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added to med list from Lakeview record.</ref> Reconciled by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-13917",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Marsh) 1/6/2025"
  }
}
```
