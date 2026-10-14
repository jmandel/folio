---
folio: "0.1"
id: "01EG1J1QR0K3VVAVAF6ENDTD41"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00520269"
effective: "2020-08-18T11:00:00-05:00"
recorded: "2020-08-18T14:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 116/72, pulse 76, wt 261 lb.
Labs 8/16: eGFR 49, K 4.3, UACR 457 mg/g, A1c 7.4%.
Problem list built today from pt's history.
RTC to review kidney and diabetes numbers.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-081859",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-081859",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-081859",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
