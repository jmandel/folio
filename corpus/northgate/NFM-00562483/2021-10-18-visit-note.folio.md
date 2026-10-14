---
folio: "0.1"
id: "01FJAH6GR03ZJH23XHKHER3MH5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00562483"
effective: "2021-10-18T09:15:00-05:00"
recorded: "2021-10-18T15:24:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well overall.
BP 133/85, pulse 77, wt 164 lb.
Labs 10/16: eGFR 72, K 4.6, LDL 143 mg/dL.
Reviewed results with pt.
RTC 1 yr, sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101833",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101833",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-101833",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
