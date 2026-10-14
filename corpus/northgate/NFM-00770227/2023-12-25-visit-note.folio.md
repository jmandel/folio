---
folio: "0.1"
id: "01HJHT5EM0T9K4ZKDZ63HFAHTV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770227"
effective: "2023-12-25T13:20:00-06:00"
recorded: "2023-12-25T19:00:00-06:00"
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
BP 133/72, pulse 67, wt 157 lb.
Labs 12/19: eGFR 82, K 4.8, A1c 8.5%, LDL 87.
A1c 8.5, empagliflozin started 10 mg daily today.
Reviewed how to take it. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-122513",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-122513",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
