---
folio: "0.1"
id: "01HB71D4708GSGG241AWZFCVWB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00911754"
effective: "2023-09-25T12:40:00-05:00"
recorded: "2023-09-25T15:45:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records reviewed with pt.
BP 118/73, pulse 65, wt 191 lb.
Exam unremarkable, no complaints today.
Problem list and med list entered from pt history.
RTC for f/u, sooner if concerns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092566",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092566",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
