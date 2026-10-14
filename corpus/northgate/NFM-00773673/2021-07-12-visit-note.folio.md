---
folio: "0.1"
id: "01FAEB9700BPDVT7HA9SQCB8K5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2021-07-12T11:40:00-05:00"
recorded: "2021-07-12T16:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 130/72, pulse 81, wt 238 lb.
7/10 labs: eGFR 95, LDL 117 mg/dL. Reviewed with pt.
Diet and exercise encouraged.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-071225",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-071225",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  }
}
```
