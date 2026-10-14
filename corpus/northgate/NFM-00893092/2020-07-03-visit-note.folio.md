---
folio: "0.1"
id: "01ECB30W10AFECSXSBE9X1BT4Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00893092"
effective: "2020-07-03T10:20:00-05:00"
recorded: "2020-07-03T14:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and history reviewed with pt.
BP 137/81, pulse 88, wt 152 lb.
eGFR 78 today, K 4.6.
Problem list built from pt's history.
RTC to recheck BP, sooner if concerns.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070368",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070368",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
