---
folio: "0.1"
id: "01GZJ2W7604KKCMX9ECA9Y3JFN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00184341"
effective: "2023-05-03T13:15:00-05:00"
recorded: "2023-05-03T19:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 148/91, repeat 146/89. Pulse 67, wt 211 lb.
Labs today: eGFR 87, K 4.7, LDL 78 mg/dL.
Discussed home BP checks and bringing readings to next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-050312",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-050312",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
