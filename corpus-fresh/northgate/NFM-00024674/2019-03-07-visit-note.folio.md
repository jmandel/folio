---
folio: "0.1"
id: "01D5CP9TX0F9P8CAME4096Y9C3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2019-03-07T10:50:00-06:00"
recorded: "2019-03-07T12:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care.
BP 149/92, repeat 141/90, pulse 68, wt 177 lb.
Labs today: eGFR 75, K 4.4, UACR 50 mg/g, A1c 8.2%.
Dapagliflozin started 10 mg daily today (A1c 8.2).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-030728",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-030728",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-030728",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
