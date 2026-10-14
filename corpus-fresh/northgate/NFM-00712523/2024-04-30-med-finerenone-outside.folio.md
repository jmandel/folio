---
folio: "0.1"
id: "01HWR53ZJR8FFF87SS67GCY0M3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2024-04-30T13:41:00-05:00"
recorded: "2024-04-30T13:43:51-05:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added from Lakeview record.</ref> Per phone med rec with pt.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-32029",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Marsh) 4/15/2024"
  }
}
```
