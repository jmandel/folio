---
folio: "0.1"
id: "01FYQ4XRW0SHPV9D8PDD9PD8RR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00816975"
effective: "2022-03-21T10:50:00-05:00"
recorded: "2022-03-21T16:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 133/81, pulse 74, wt 226 lb.
eGFR 65, K 4.1, UACR 912 mg/g, A1c 7.7%, LDL 119 mg/dL today.
Reviewed labs with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-032114",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-032114",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
