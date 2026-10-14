---
folio: "0.1"
id: "01EC8S4ZG05FD6FP592EQBWJ8T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00364929"
effective: "2020-07-02T11:50:00-05:00"
recorded: "2020-07-02T17:08:00-05:00"
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
BP 144/81, repeat 141/81. Pulse 78, wt 248 lb.
eGFR 81 today, K 4.7.
Problem list entered from pt history.
Will recheck BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070238",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070238",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-070238",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
