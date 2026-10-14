---
folio: "0.1"
id: "01E8MRST60T1AMM44PRE61JAGP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2020-05-18T09:40:00-05:00"
recorded: "2020-05-18T15:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History reviewed with pt, problem list started.
BP 114/65, pulse 83, wt 182 lb.
eGFR 84 today. LDL 105 mg/dL today.
Questions answered. Records to be requested from prior office.
RTC for annual exam.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-051885",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-051885",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
