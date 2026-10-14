---
folio: "0.1"
id: "01FVX1BAMR4QADW66ZKVVW0MTC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2022-02-14T15:11:00-06:00"
recorded: "2022-02-14T15:13:51-06:00"
author:
  id: "urn:northgate-fm.example:staff:kfoster"
  name: "Kim Foster, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">finerenone 10 mg daily added per outside record.</ref>

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-23528",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Adeyemi) 1/31/2022"
  }
}
```
