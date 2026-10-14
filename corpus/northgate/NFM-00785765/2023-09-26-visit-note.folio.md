---
folio: "0.1"
id: "01HB9GK9Z0RFQQQJYZT5JNZBT6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2023-09-26T11:30:00-05:00"
recorded: "2023-09-26T14:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 142/83, repeat 137/83, pulse 64, wt 219 lb.
Labs 9/21: eGFR 62, K 4.4, A1c 7%, LDL 73 mg/dL.
BP above goal, losartan dose changed to 100 mg daily today.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092651",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092651",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
