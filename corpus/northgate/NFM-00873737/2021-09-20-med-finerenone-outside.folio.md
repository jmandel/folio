---
folio: "0.1"
id: "01FG1WE52RH82FPA4MBK9J01N5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2021-09-20T10:13:00-05:00"
recorded: "2021-09-20T10:15:51-05:00"
author:
  id: "urn:northgate-fm.example:staff:nortiz"
  name: "Nina Ortiz, RN"
  role: "Registered nurse"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="med_1">Finerenone 10 mg daily added to med list from the Lakeview record.</ref> Confirmed by phone.

```json payload
{
  "med_1": {
    "type": "med_event",
    "med_id": "ML-26621",
    "action": "start",
    "origin": "outside",
    "drug": { "name": "finerenone 10 mg tablet", "outside_code": { "system": "lakeview-drug", "code": "LVD-04471" } },
    "dose": { "value": 10, "unit": "mg" },
    "frequency": "QD",
    "sig": "Take 1 tablet by mouth daily",
    "reason_text": "Prescribed by Lakeview nephrology (Dr. Adeyemi) 9/7/2021"
  }
}
```
