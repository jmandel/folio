---
folio: "0.1"
id: "01FMT3GEM02YTP78W0MQP0VDG7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00089203"
effective: "2021-11-18T08:00:00-06:00"
recorded: "2021-11-18T12:04:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 156/92, repeat 150/90. Pulse 85, wt 199 lb.
eGFR 65 today, K 4.8. LDL 106 mg/dL.
Still above goal. Chlorthalidone started 12.5 mg daily today.
Will recheck labs and BP at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-111857",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-111857",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
